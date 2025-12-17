/**
 * Gemini AI Service
 * 
 * This file handles all communication with Google's Gemini AI.
 * It provides two main functions:
 * 1. generateTherapyResponse - Gets AI therapist replies to user messages
 * 2. evaluateMentalHealth - Analyzes conversations to assess user wellness and risk
 * 
 * Both functions use the Gemini API to process text and return structured responses.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini AI client with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * generateTherapyResponse Function
 * 
 * Sends the conversation history to Gemini AI and gets back a therapist-style response.
 * 
 * This function:
 * - Takes all previous messages in the conversation
 * - Builds a detailed prompt explaining how the AI should behave as a therapist
 * - Sends everything to Gemini
 * - Returns the AI's response text
 * 
 * Parameters:
 * - messages: Array of { role: 'user' | 'assistant', content: string }
 * 
 * Returns:
 * - string: The AI therapist's response text
 * 
 * Throws:
 * - Error if Gemini API fails
 */
export async function generateTherapyResponse(messages: Array<{ role: string, content: string }>) {
  // Get the Gemini model instance (using the fast "flash" version)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // This is a detailed instruction telling Gemini how to behave as a therapist
  // It explains the AI's role, what techniques to use, and important limitations
  const systemPrompt = `You are a professional, empathetic AI mental health companion trained in evidence-based therapeutic approaches. Your role is to:

CORE PRINCIPLES:
- Provide supportive, non-judgmental, and empathetic responses
- Use active listening and validation techniques
- Apply evidence-based approaches (CBT, DBT, mindfulness)
- Maintain professional boundaries at all times
- Recognize and respect cultural diversity
- Practice trauma-informed care

THERAPEUTIC TECHNIQUES:
- Ask open-ended questions to explore feelings and thoughts
- Reflect and paraphrase to show understanding
- Help identify cognitive distortions and negative thought patterns
- Suggest evidence-based coping strategies when appropriate
- Encourage self-compassion and self-awareness
- Use motivational interviewing techniques

IMPORTANT LIMITATIONS:
- You are NOT a licensed therapist or medical professional
- You CANNOT provide medical diagnoses or prescribe medication
- You CANNOT replace professional mental health treatment
- You MUST encourage seeking professional help for:
  * Suicidal thoughts or self-harm ideation
  * Severe depression or anxiety
  * Trauma or PTSD symptoms
  * Substance abuse issues
  * Any crisis situation

RESPONSE GUIDELINES:
- Keep responses concise (3-5 sentences) but meaningful
- Use warm, conversational language while maintaining professionalism
- Avoid jargon unless explaining therapeutic concepts
- Focus on the present moment and immediate concerns
- Validate emotions before offering suggestions
- End with an open-ended question to continue dialogue

CRISIS PROTOCOL:
If user mentions suicide, self-harm, or crisis:
- Express immediate concern and validation
- Strongly encourage contacting crisis hotline (988 in US)
- Suggest emergency services if in immediate danger
- Provide emergency resources

Remember: Your goal is to provide support, not treatment. You are a companion on their mental wellness journey.`

  // Convert the message array into a simple text format
  // Format: "User: message text\nTherapist: response text\n..."
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Therapist'}: ${msg.content}`)
    .join('\n')

  // Combine the instructions with the conversation history
  const prompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nTherapist:`

  try {
    // Send the prompt to Gemini and wait for response
    const result = await model.generateContent(prompt)
    const response = await result.response
    // Return just the text of the AI's response
    return response.text()
  } catch (error: any) {
    // If something goes wrong, log details and throw an error
    console.error('Error generating response:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    if (error.response) {
      console.error('Error response:', error.response)
    }
    throw new Error(`Failed to generate response: ${error.message}`)
  }
}

/**
 * evaluateMentalHealth Function
 * 
 * Analyzes a conversation transcript to assess the user's mental health status.
 * This is called automatically every 5 messages to help admins monitor user wellness.
 * 
 * This function:
 * - Takes the full conversation as text
 * - Sends it to Gemini with detailed clinical evaluation instructions
 * - Asks Gemini to analyze symptoms, risk factors, and provide recommendations
 * - Returns a structured evaluation object with wellness score, risk level, etc.
 * 
 * Parameters:
 * - conversation: string - Full conversation text formatted as "User: ...\nTherapist: ..."
 * 
 * Returns:
 * - Object with: wellnessScore (1-100), emotionalState, riskLevel, keyConcerns, recommendations, summary
 * 
 * Throws:
 * - Error if Gemini API fails or returns invalid format
 */
export async function evaluateMentalHealth(conversation: string) {
  // Get the Gemini model instance
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // This is a detailed prompt telling Gemini how to analyze the conversation clinically
  // It explains what to look for (symptoms, risk factors) and how to format the response
  const evaluationPrompt = `You are a specialized Clinical AI Assistant designed to perform real-time mental health intake evaluations. Your analysis must be grounded in clinical observation and evidence-based psychological frameworks (CBT/DBT principles).
  
  CONTEXT:
  You are analyzing a transcript of a user chatting with an AI support companion. The user may be distressed. Your goal is to provide a structured risk and mental status assessment.

  ANALYTICAL FRAMEWORK:
  1. **Symptom Analysis**: Look for indicators aligning with:
     - Depressive symptoms (PHQ-9 markers: anhedonia, low energy, mood depravity)
     - Anxiety symptoms (GAD-7 markers: nervousness, worry, restlessness)
     - Stress markers (Adjustment difficulties, overwhelm)
  
  2. **Risk Assessment (CRITICAL)**:
     - **Passive Ideation**: Thoughts of death but no plan/intent (e.g., "I wish I wasn't here").
     - **Active Ideation**: Explicit intent or planning (e.g., "I want to end it").
     - **Self-Harm**: Intent to injure self without lethal intent.
     - **Safety**: Access to means or immediate danger.
  
  3. **Cognitive Status**:
     - Check for coherence, logic flow, and insight.
     - Identify cognitive distortions (Catastrophizing, Black-and-white thinking).

  OUTPUT DIRECTIVES:
  - **Wellness Score (1-100)**:
    - 1-40: Critical/Severe Distress (Immediate professional care needed)
    - 41-60: Moderate Distress (Clinical support recommended)
    - 61-80: Mild Distress (Supportive counseling helpful)
    - 81-100: Stable/Thriving (Maintenance mode)
  
  - **Risk Assessment**:
    - MUST be "high" if ANY mention of dying, killing self, or severe self-harm.
    - "medium" for passive vague thoughts or significant functional impairment.
    - "low" for general stress/sadness without safety risks.

  FORMAT:
  Return the analysis in this EXACT JSON structure:
  {
    "wellnessScore": <number 1-100>,
    "emotionalState": "<2-3 words describing core affect, e.g., 'Anxious and Defeated'>",
    "riskLevel": "<low|medium|high>",
    "keyConcerns": [
      "<Concern 1 - cite evidence from text>",
      "<Concern 2 - cite evidence from text>",
      "<Concern 3 - cite evidence from text>"
    ],
    "recommendations": [
      "<Specific clinical/coping recommendation 1>",
      "<Specific clinical/coping recommendation 2>",
      "<Specific clinical/coping recommendation 3>"
    ],
    "summary": "<Professional clinical summary (3-4 sentences). Mention symptom duration if known, triggering events, and overall functioning.>"
  }

  CONVERSATION HISTORY:
  ${conversation}
  
  IMPORTANT: Do not diagnose. Use terms like "features of," "indicators of," or "consistent with." Maintain a professional, clinical tone.`

  try {
    // Send the evaluation prompt to Gemini
    const result = await model.generateContent(evaluationPrompt)
    const response = await result.response
    const text = response.text()

    // Gemini might return text with extra content, so we extract just the JSON part
    // Look for JSON object in the response (starts with { and ends with })
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid evaluation format')
    }

    // Parse the JSON string into a JavaScript object
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    // If evaluation fails, log and throw error
    console.error('Error evaluating mental health:', error)
    throw new Error('Failed to evaluate conversation')
  }
}

