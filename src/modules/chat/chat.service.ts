import { GoogleGenAI } from "@google/genai"; 
import config from "../../config";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const generateAiReply = async (message: string) => {
	if (!config.geminiApiKey) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Google Gemini API key is missing in config.");
	}

	try {
		// ১. গুগল এআই ক্লায়েন্ট ইনিশিয়েট করা
		const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
		
		const response = await ai.models.generateContent({
			model: "gemini-3.8-flash", 
			contents: message,
		});

		return {
			reply: response.text || "I couldn't process that text. Please try asking differently.",
		};
	} catch (error: any) {
		// 🛠️ ফিক্স: যদি গুগল সার্ভার ৫0৩ এরর দেয়, তবে ইউজার ফ্রেন্ডলি মেসেজ থ্রো করা হবে
		if (error?.status === "UNAVAILABLE" || error?.message?.includes("503") || error?.message?.includes("high demand")) {
			throw new AppError(
				httpStatus.SERVICE_UNAVAILABLE, 
				"EnterCount AI helper is experiencing high demand right now. Please try sending your message again in a few seconds!"
			);
		}

		// অন্য কোনো সাধারণ এরর হলে সেটি পাস করা
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR, 
			error?.message || "Failed to communicate with EnterCount AI assistant."
		);
	}
};

export const ChatService = {
	generateAiReply,
};
