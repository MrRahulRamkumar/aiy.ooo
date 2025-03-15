import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="container max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated on 16-03-2025 01:41:26
          </p>
        </div>

        <section className="space-y-4">
          <p>You may contact us using the information below:</p>

          <div className="mt-6 space-y-6">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Merchant Legal entity name:</h3>
                <p>RAHUL RAMKUMAR</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Registered Address:</h3>
                <p>
                  321A, 11th Street, Kuberan nagar extension, Madipakkam, Tamil
                  Nadu, PIN: 600091
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Operational Address:</h3>
                <p>321A, 11th Street, Madipakkam, Tamil Nadu, PIN: 600091</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Telephone No:</h3>
                <p>
                  <a href="tel:9840612462" className="hover:underline">
                    9840612462
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">E-Mail ID:</h3>
                <p>
                  <a
                    href="mailto:rahulawesomeramkumar@gmail.com"
                    className="hover:underline"
                  >
                    rahulawesomeramkumar@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
