import api from "./index";

export const ContactApi = {
  async send(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    const response = await api.post(
      "/v1/contact",
      data
    );

    return response.data;
  },
};
