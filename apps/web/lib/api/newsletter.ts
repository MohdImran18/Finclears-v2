import type { NewsletterSubscriber } from "@/types/newsletter";
import api, { API } from "./index";

interface NewsletterResponse {
	data: {
		subscriber: NewsletterSubscriber;
	};
}

export const NewsletterApi = {
	/**
	 * Subscribe Newsletter
	 */
	async subscribe(email: string): Promise<NewsletterSubscriber> {
		const { data } = await api.post<NewsletterResponse>(
			API.NEWSLETTER_SUBSCRIBE,
			{
				email,
			},
		);

		return data.data.subscriber;
	},
};

export default NewsletterApi;

