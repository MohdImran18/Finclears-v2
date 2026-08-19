import api from "@/lib/api";

export const ReviewService = {
    generate(data: any) {
        return api.post(
            "/review",
            data
        );
    },
};

export default ReviewService;
