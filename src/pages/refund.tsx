import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="container max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated on 16-03-2025 01:45:31
          </p>
        </div>

        <section className="space-y-4">
          <p>
            RAHUL RAMKUMAR believes in helping its customers as far as possible,
            and has therefore a liberal cancellation policy. Under this policy:
          </p>

          <ul className="list-disc space-y-4 pl-6">
            <li>
              Cancellations will be considered only if the request is made
              immediately after placing the order. However, the cancellation
              request may not be entertained if the orders have been
              communicated to the vendors/merchants and they have initiated the
              process of shipping them.
            </li>

            <li>
              RAHUL RAMKUMAR does not accept cancellation requests for
              perishable items like flowers, eatables etc. However,
              refund/replacement can be made if the customer establishes that
              the quality of product delivered is not good.
            </li>

            <li>
              In case of receipt of damaged or defective items please report the
              same to our Customer Service team. The request will, however, be
              entertained once the merchant has checked and determined the same
              at his own end. This should be reported within 7 Days days of
              receipt of the products. In case you feel that the product
              received is not as shown on the site or as per your expectations,
              you must bring it to the notice of our customer service within 7
              Days days of receiving the product. The Customer Service Team
              after looking into your complaint will take an appropriate
              decision.
            </li>

            <li>
              In case of complaints regarding products that come with a warranty
              from manufacturers, please refer the issue to them. In case of any
              Refunds approved by the RAHUL RAMKUMAR, it'll take 3-5 Days days
              for the refund to be processed to the end customer.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
