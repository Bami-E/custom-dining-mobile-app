import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import ChatbotService, { ChatMessage, initialBotMessage } from '../services/chatbotService';

// Individual chat bubble component
const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';
  return (
    <View style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', marginVertical: 5 }}>
      <View
        style={{
          backgroundColor: isUser ? colors.primary : '#E5E5EA',
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingVertical: 10,
          maxWidth: '80%',
        }}
      >
        <Text style={{ color: isUser ? 'white' : 'black', fontSize: 16 }}>
          {message.parts[0].text}
        </Text>
      </View>
    </View>
  );
};

export default function FaqChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim().length === 0) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input.trim() }] };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botResponseText = await ChatbotService.getBotResponse(newMessages);
      const botMessage: ChatMessage = { role: 'model', parts: [{ text: botResponseText }] };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get bot response:", error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "I'm having some trouble right now. Please try again later." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen
        options={{
          headerTitle: 'FAQ & Help',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 10 }}
        />

        {isLoading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 5 }}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={{ color: colors.darkGray, marginLeft: 10, fontStyle: 'italic' }}>
              Chef Gemini is typing...
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              backgroundColor: '#F0F0F0',
              borderRadius: 20,
              paddingHorizontal: 15,
              fontSize: 16,
            }}
            placeholder="Ask a question..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={handleSend} style={{ marginLeft: 10 }} disabled={isLoading}>
            <Ionicons name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 