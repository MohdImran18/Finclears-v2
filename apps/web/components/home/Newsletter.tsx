import Container from "@/components/layout/Container";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function Newsletter() {
  return (
    <section
      id="newsletter"
      className="bg-white py-24"
    >
      <Container>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-16 text-center text-white shadow-2xl lg:px-16">

          <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider">
            Newsletter
          </span>

          <h2 className="mt-6 text-4xl font-bold lg:text-5xl">
            Stay Updated With
            <br />
            Business Compliance
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Get expert insights on Company Registration,
            GST, Trademark, Income Tax, ROC Compliance,
            Startup India and important government updates
            delivered directly to your inbox.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <NewsletterForm />
          </div>

          <p className="mt-6 text-sm text-blue-100">
            No spam. Unsubscribe anytime.
          </p>

        </div>

      </Container>
    </section>
  );
}
