/**
 * Disclaimer Page Component
 * 
 * This page displays important legal and medical disclaimers about the platform.
 * It explains what the AI therapist can and cannot do, privacy information, and terms of use.
 * This page is accessible at: "/disclaimer"
 * 
 * This is a static informational page - it doesn't have any interactive functionality,
 * just displays important information users should read before using the service.
 */

import { AlertCircle, Shield, Heart, Lock } from 'lucide-react'

/**
 * DisclaimerPage Function
 * 
 * Renders a comprehensive disclaimer page with multiple sections:
 * - Medical disclaimer (not a replacement for professional help)
 * - What the platform provides
 * - What the platform does NOT provide
 * - When to seek professional help
 * - Privacy and data storage information
 * - Terms of use
 * - Evidence-based practices information
 */
export default function DisclaimerPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Important Information</h1>

            {/* Main Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <div className="flex">
                    <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    <div className="ml-3">
                        <h2 className="text-lg font-medium text-yellow-900 mb-2">Medical Disclaimer</h2>
                        <div className="text-sm text-yellow-800 space-y-2">
                            <p>
                                <strong>SereneMind is NOT a substitute for professional medical advice, diagnosis, or treatment.</strong>
                            </p>
                            <p>
                                This AI-powered platform is designed to provide supportive conversations and mental wellness resources. It is NOT a replacement for:
                            </p>
                            <ul className="list-disc ml-5 mt-2 space-y-1">
                                <li>Licensed mental health professionals (therapists, psychologists, psychiatrists)</li>
                                <li>Medical doctors or healthcare providers</li>
                                <li>Emergency mental health services</li>
                                <li>Crisis intervention specialists</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* What This Platform Is */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-primary-600" />
                    What SereneMind Provides
                </h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>Supportive, empathetic conversations using AI technology</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>Evidence-based coping strategies and wellness techniques</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>Tools for mood tracking and self-reflection</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>Educational resources about mental health</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>A safe space for journaling and personal growth</span>
                    </li>
                </ul>
            </div>

            {/* What This Platform Is NOT */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    What SereneMind Does NOT Provide
                </h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span><strong>Medical diagnoses</strong> - Only licensed professionals can diagnose mental health conditions</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span><strong>Prescription medications</strong> - We cannot prescribe or recommend specific medications</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span><strong>Emergency services</strong> - For crises, contact 988 or emergency services immediately</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span><strong>Professional therapy</strong> - AI cannot replace the expertise of licensed therapists</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        <span><strong>Legal or medical advice</strong> - Consult appropriate professionals for these matters</span>
                    </li>
                </ul>
            </div>

            {/* When to Seek Professional Help */}
            <div className="bg-red-50 rounded-lg p-6 mb-6 border border-red-200">
                <h2 className="text-xl font-semibold text-red-900 mb-4">When to Seek Professional Help Immediately</h2>
                <p className="text-sm text-red-800 mb-4">
                    Please contact a mental health professional or emergency services if you experience:
                </p>
                <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Thoughts of suicide or self-harm</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Thoughts of harming others</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Severe depression or anxiety that interferes with daily life</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Hallucinations or delusions</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Substance abuse or addiction</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Trauma or PTSD symptoms</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Eating disorders</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Any mental health crisis</span>
                    </li>
                </ul>
                <div className="mt-4 p-4 bg-red-100 rounded">
                    <p className="font-semibold text-red-900">Crisis Resources:</p>
                    <p className="text-sm text-red-800">988 Suicide & Crisis Lifeline: Call or text 988</p>
                    <p className="text-sm text-red-800">Crisis Text Line: Text HELLO to 741741</p>
                    <p className="text-sm text-red-800">Emergency: Call 911</p>
                </div>
            </div>

            {/* Privacy & Data */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-primary-600" />
                    Privacy & Data Storage
                </h2>
                <div className="space-y-3 text-gray-700 text-sm">
                    <p>
                        <strong>Local Storage:</strong> Your mood entries and journal entries are stored locally on your device using browser localStorage. This data never leaves your device.
                    </p>
                    <p>
                        <strong>Chat Sessions:</strong> Therapy chat sessions are stored temporarily in server memory for the duration of your session and admin evaluation purposes. They are not permanently saved to a database.
                    </p>
                    <p>
                        <strong>No Personal Identification:</strong> We do not collect personally identifiable information such as names, email addresses, or phone numbers.
                    </p>
                    <p>
                        <strong>AI Processing:</strong> Conversations are processed by Google's Gemini AI. Please review Google's privacy policy for information about their data handling.
                    </p>
                    <p className="text-yellow-800 bg-yellow-50 p-3 rounded">
                        <strong>Important:</strong> Do not share sensitive personal information (full name, address, financial details, etc.) in chat conversations.
                    </p>
                </div>
            </div>

            {/* Terms of Use */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms of Use</h2>
                <div className="space-y-3 text-gray-700 text-sm">
                    <p>By using SereneMind, you acknowledge and agree that:</p>
                    <ol className="list-decimal ml-5 space-y-2">
                        <li>You are at least 13 years of age (users under 18 should have parental consent)</li>
                        <li>You understand this is an AI-powered tool, not a licensed therapist</li>
                        <li>You will seek professional help for serious mental health concerns</li>
                        <li>You will not use this platform for emergency situations</li>
                        <li>You are responsible for your own mental health and well-being</li>
                        <li>The platform creators are not liable for any outcomes from using this service</li>
                        <li>You will use the platform responsibly and ethically</li>
                    </ol>
                </div>
            </div>

            {/* Evidence-Based Practices */}
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Evidence-Based Approach</h2>
                <p className="text-sm text-primary-800 mb-3">
                    SereneMind incorporates evidence-based therapeutic approaches including:
                </p>
                <ul className="space-y-2 text-sm text-primary-800">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span><strong>Cognitive Behavioral Therapy (CBT)</strong> - Identifying and changing negative thought patterns</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span><strong>Dialectical Behavior Therapy (DBT)</strong> - Emotional regulation and mindfulness</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span><strong>Mindfulness-Based Practices</strong> - Present-moment awareness and acceptance</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span><strong>Motivational Interviewing</strong> - Supporting personal change and growth</span>
                    </li>
                </ul>
                <p className="text-xs text-primary-700 mt-4">
                    These approaches are based on peer-reviewed research and clinical best practices in mental health care.
                </p>
            </div>

            {/* Contact */}
            <div className="mt-8 text-center text-sm text-gray-600">
                <p>Last Updated: December 2025</p>
                <p className="mt-2">
                    For questions or concerns, please consult with a licensed mental health professional.
                </p>
            </div>
        </div>
    )
}
