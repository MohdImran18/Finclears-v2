import api from "@/lib/api";

class ItrService {
    /**
     * Check Existing Draft Return
     */
    checkExisting(data: any) {
        return api.post(
            "/itr-returns/check-existing",
            data
        );
    }

    /**
     * Create ITR Return
     */
    create(data: any) {
        return api.post(
            "/itr-returns",
            data
        );
    }

    /**
     * Get All Returns
     */
    getAll() {
        return api.get(
            "/itr-returns"
        );
    }

    /**
     * Get Single Return
     */
    get(uuid: string) {
        return api.get(
            `/itr-returns/${uuid}`
        );
    }

    /**
     * Update Return
     */
    update(
        uuid: string,
        data: any
    ) {
        return api.put(
            `/itr-returns/${uuid}`,
            data
        );
    }

    /**
     * Delete Return
     */
    delete(uuid: string) {
        return api.delete(
            `/itr-returns/${uuid}`
        );
    }

    /**
     * Calculate Tax
     */
    calculate(
        uuid: string,
        data: any
    ) {
        return api.post(
            `/itr-returns/${uuid}/calculate-tax`,
            data
        );
    }

    /**
     * Submit Return
     */
    submit(uuid: string) {
        return api.post(
            `/itr-returns/${uuid}/submit`
        );
    }

    /**
     * Download PDF
     */
    download(uuid: string) {
        return api.get(
            `/itr-returns/${uuid}/download`,
            {
                responseType: "blob",
            }
        );
    }

    /**
     * Review Return
     */
    review(uuid: string) {
        return api.get(
            `/itr-returns/${uuid}/review`
        );
    }
}

const itrService = new ItrService();

export default itrService;