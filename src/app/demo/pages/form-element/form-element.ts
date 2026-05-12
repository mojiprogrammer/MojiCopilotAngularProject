import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../theme/shared/shared.module';

@Component({
  selector: 'app-form-element',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, NgbDropdownModule],
  templateUrl: './form-element.html',
  styleUrl: './form-element.scss'
})
export class FormElement
{
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Properties
  userMessage: string = '';
  messages: ChatMessage[] = [];
  isLoading: boolean = false;
  isStreaming: boolean = false;
  currentStreamingMessage: string = '';
  errorMessage: string = '';

  // API URLs (adjust based on your backend URL)
  private apiUrl = 'https://localhost:5864/api/DeepSeekAPI'; // Changed to match controller name
  private httpSubscription?: Subscription;
  constructor(private http: HttpClient)
  {
    // Add welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hello! I am DeepSeek AI. How can I help you today?',
      timestamp: new Date()
    });
  }


  // Send message to API (non-streaming)
  sendMessage()
  {
    if (!this.userMessage.trim())
    {
      return;
    }

    // Add user message to chat
    const userMsg: ChatMessage = {
      role: 'user',
      content: this.userMessage,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    const currentMessage = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;
    this.errorMessage = '';

    const request: DeepSeekChatRequest = {
      messages: this.messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature: 0.7,
      maxTokens: 2000
    };

    this.http.post<any>(`${ this.apiUrl }/chat`, request).subscribe({
      next: (response) =>
      {
        // Add assistant response
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          usage: response.usage
        };
        this.messages.push(assistantMsg);
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) =>
      {
        console.error('Error sending message:', error);
        this.errorMessage = error.error?.error || 'Failed to get response from DeepSeek';

        // Add error message to chat
        const errorMsg: ChatMessage = {
          role: 'system',
          content: `Error: ${ this.errorMessage }`,
          timestamp: new Date(),
          isError: true
        };
        this.messages.push(errorMsg);
        this.isLoading = false;
        this.scrollToBottom();
      }
    });
  }

  // Send message with streaming
  async sendMessageStream()
  {
    if (!this.userMessage.trim())
    {
      return;
    }

    // Add user message to chat
    const userMsg: ChatMessage = {
      role: 'user',
      content: this.userMessage,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    const currentMessage = this.userMessage;
    this.userMessage = '';
    this.isStreaming = true;
    this.currentStreamingMessage = '';
    this.errorMessage = '';

    // Add a placeholder for streaming response
    const streamingPlaceholder: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    this.messages.push(streamingPlaceholder);
    this.scrollToBottom();

    try
    {
      const request: DeepSeekChatRequest = {
        messages: this.messages.filter(m => m !== streamingPlaceholder && m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.7,
        maxTokens: 2000,
        stream: true
      };

      const response = await fetch(`${ this.apiUrl }/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader)
      {
        let buffer = '';

        while (true)
        {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines)
          {
            if (line.startsWith('data: '))
            {
              const data = line.substring(6);
              if (data === '[DONE]')
              {
                streamingPlaceholder.isStreaming = false;
                break;
              }

              try
              {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                this.currentStreamingMessage += content;
                streamingPlaceholder.content = this.currentStreamingMessage;
                this.scrollToBottom();
              } catch (e)
              {
                console.error('Error parsing stream data:', e);
              }
            }
          }
        }
      }

      streamingPlaceholder.isStreaming = false;
      if (!streamingPlaceholder.content)
      {
        streamingPlaceholder.content = 'No response received';
      }

    } catch (error: any)
    {
      console.error('Error in streaming:', error);
      this.errorMessage = error.message || 'Failed to get streaming response';

      streamingPlaceholder.content = `Error: ${ this.errorMessage }`;
      streamingPlaceholder.isError = true;
      streamingPlaceholder.isStreaming = false;
    } finally
    {
      this.isStreaming = false;
      this.currentStreamingMessage = '';
      this.scrollToBottom();
    }
  }

  // Clear chat history
  clearChat()
  {
    this.messages = [];
    this.messages.push({
      role: 'assistant',
      content: 'Chat cleared! How can I help you?',
      timestamp: new Date()
    });
    this.errorMessage = '';
    this.scrollToBottom();
  }

  // Scroll to bottom of chat
  private scrollToBottom()
  {
    setTimeout(() =>
    {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer)
      {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  // Handle enter key press
  onEnterPress(event: KeyboardEvent)
  {
    if (event.ctrlKey || event.key === 'Enter')
    {
      if (!event.shiftKey)
      {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }
}

// Interfaces
export interface ChatMessage
{
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  usage?: any;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface DeepSeekChatRequest
{
  messages: DeepSeekMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface DeepSeekMessage
{
  role: string;
  content: string;
}
