
import { useEffect, useState } from "react";
import {
  getSetting,
  saveSetting,
} from "../../../../services/admin/settings.service";

const DEFAULT_POLICIES = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Your privacy matters",
    description:
      "At Adya by Anjana, we value your trust. Learn how we collect, use and protect your personal information when you visit our website or shop with us.",
    badge: "Privacy and personal information",
    contactTitle: "Questions about your privacy?",
    contactDescription:
      "If you have questions about how your information is handled, please contact the ADYA team through the contact details published on our website.",
    contactLabel: "Contact us",
    sections: [
      {
        id: "about",
        label: "01 / Introduction",
        title: "1. About this policy",
        content:
          "Adya by Anjana respects your privacy. This policy explains how [Anjana Karun], trading as Adya by Anjana, collects, holds, uses and shares personal information when you browse our website, buy from us or contact us.",
      },
      {
        id: "information",
        label: "02 / Information collection",
        title: "2. Information we collect and how we collect it",
        content:
          "We collect information you provide during checkout, account registration if available, enquiries, returns or newsletter sign-up. This may include your name, email, telephone number, billing and delivery addresses, order history, correspondence and return information. If you nominate a gift recipient, we receive their delivery details from you; please provide only details you are authorised to share.\n\nPayment providers process payment information. Do not send full card details by email or social media. We do not ask for sensitive information to buy a saree; please avoid including it in messages or return photographs.",
      },
      {
        id: "usage",
        label: "03 / How we use information",
        title: "3. Why we use information",
        content:
          "To accept payments, fulfil and deliver orders, provide order updates and handle returns and complaints.\n\nTo answer enquiries, maintain customer records, secure our systems and investigate suspected fraud.\n\nTo send marketing where we have the required consent and to understand website use through the tools disclosed below.\n\nIf you do not supply information needed to process an order or verify a request, we may be unable to complete it. You may browse or make general enquiries anonymously or under a pseudonym where practical. We need accurate customer and delivery information to fulfil purchases.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    eyebrow: "Legal information",
    description:
      "Please read these terms carefully before shopping with Adya by Anjana. They explain how our online boutique operates and the terms that apply when you purchase from us.",
    badge: "Website use and purchases",
    contactTitle: "Need help with an order?",
    contactDescription:
      "If you have a question about these terms, your purchase or delivery, please contact the ADYA team through the contact details published on our website.",
    contactLabel: "Contact us",
    sections: [
      {
        id: "overview",
        label: "01 / Introduction",
        title: "1. Overview",
        content:
          "Welcome to Adya by Anjana. Our online boutique offers sarees to customers in the delivery locations shown at checkout. In these terms, “we”, “us” and “our” mean the legal operator identified above. “You” means the person browsing our website or placing an order.\n\nThese terms explain website use and purchases from our store. Please read them and our Returns & Refunds Policy before ordering.",
      },
      {
        id: "accounts",
        label: "02 / Your account",
        title: "2. Online store and account information",
        content:
          "If customer accounts are available, keep your login details secure and notify us promptly if you suspect unauthorised access. Contact us as soon as possible about incorrect order details. We will make reasonable efforts to correct them before dispatch. We will not hold you automatically responsible for activity caused by a failure of our systems or our own conduct.",
      },
      {
        id: "products",
        label: "03 / Our collections",
        title: "3. Products, descriptions and availability",
        content:
          "We sell sarees as described on each product page and do not provide stitching or alterations. Check the listed fabric, dimensions, care instructions and included pieces before purchase. Product listings identify whether a blouse piece is supplied and whether it is attached or separate. Jewellery, blouses and other styling accessories are included only where the listing expressly says so.\n\nWe aim to represent colours, patterns and details accurately. Screen settings and lighting can affect how images appear. Handwoven or handmade items may have individual characteristics that are explained in the listing. These explanations do not excuse material differences from the description, undisclosed defects or failures to meet consumer guarantees.\n\nStock may be limited. Any purchase limits, pre-order status and delivery restrictions will be disclosed before checkout. We may update our range or future availability, but changes will not reduce our obligations for an accepted order. Please follow the care instructions supplied with your saree.",
      },
      {
        id: "prices",
        label: "04 / Payments",
        title: "4. Prices, promotions and payments",
        content:
          "All prices are displayed in Australian dollars (AUD) by default and include GST where applicable. You can use the currency selector on our website to view saree prices in your preferred supported currency. Delivery charges and other applicable charges are disclosed before you commit to purchase. Available payment methods are shown at checkout. Payment-provider terms may apply to their service without reducing your rights against us.\n\nPrices may change for future purchases. A price change will not alter an accepted order without your agreement. Conditions, eligibility, exclusions and expiry dates for promotions will be disclosed with the offer. Discounts apply as stated and cannot be retrospectively applied unless we agree. We will not add undisclosed charges after checkout.",
      },
      {
        id: "orders",
        label: "05 / Order processing",
        title: "5. Orders and acceptance",
        content:
          "Placing an order is an offer to purchase the selected goods on these terms. We send an electronic acknowledgement. An automated receipt alone is not acceptance, and we will assess orders promptly.\n\nBefore acceptance, we may decline an order for a genuine reason, including unavailable stock, inability to deliver to the nominated location or reasonable evidence of unauthorised payment. We will explain the reason where lawful and promptly refund any payment for a declined order. We will not substitute another product without your agreement.\n\nAfter acceptance, we will fulfil the order as agreed. If a genuine problem prevents fulfilment, we will contact you promptly to discuss a solution. If we cannot supply the affected goods and you do not agree to an alternative, we will refund the affected purchase and associated delivery charges. We will not require you to accept store credit instead of a refund owed to you.",
      },
      {
        id: "errors",
        label: "06 / Corrections",
        title: "6. Errors and corrections",
        content:
          "If we discover an error in a description, price, promotion or availability, we will correct the listing and contact affected customers promptly. We will explain your options before asking you to agree to a change. We will not rely on a general right to correct errors to override an accepted order. If an order cannot proceed, refunds will be handled as described above and as required by law.",
      },
      {
        id: "delivery",
        label: "07 / Shipping",
        title: "7. Delivery and pre-orders",
        content:
          "We deliver to the destinations offered at checkout. In-stock orders are normally dispatched within [2-3] business days. Delivery estimates by destination are [Inside Australia-4-6 working days and Outside Australia-8-12 working days]. Business days exclude weekends and relevant public holidays. Pre-orders will show their estimated dispatch date before purchase; we will advise you of material delays and explain available options.\n\nFor international orders, any customs duties, import taxes or clearance fees imposed by the destination country are the customer’s responsibility. These charges are separate from our product prices and shipping fees, unless expressly stated at checkout.\n\nPlease contact us before ordering if delivery by a particular date is important. Estimates do not remove your rights if we fail to supply as agreed or within a reasonable time. If your parcel is lost, damaged or significantly delayed, contact us so we can investigate and provide an appropriate solution.\n\nIf an incorrect address supplied by you requires redelivery, we will discuss any reasonable additional cost before arranging it.\n\nCharges vary by destination. Please check with your local customs authority before placing an order. International deliveries may also be delayed by customs processing.",
      },
      {
        id: "cancellations",
        label: "08 / Changes",
        title: "8. Order changes and cancellations",
        content:
          "Contact us promptly if you wish to change an address, amend an order or request cancellation. We will make reasonable efforts to help before dispatch. If cancellation is agreed, we refund the cancelled goods and delivery charges not incurred. After dispatch, our Returns & Refunds Policy applies.",
      },
      {
        id: "reviews",
        label: "09 / Community",
        title: "9. Reviews, feedback and customer photographs",
        content:
          "If reviews or public comments are enabled, submit only genuine feedback and material you are entitled to share. Do not post unlawful, defamatory, misleading or abusive material, personal information about others without permission, or content that infringes intellectual property rights.\n\nYou retain ownership of your submissions. When you submit a review for publication on our website, you allow us to display it with the display name you choose and make minor formatting changes that do not alter its meaning. We will seek separate permission before using your photographs, name or review in advertising beyond that review display.\n\nWe may moderate content for genuine reasons such as spam, unlawful material, privacy concerns or an unrelated submission. We will not remove or alter reviews merely because they express a genuine negative opinion. Contact us if you want to discuss removal of your own submission.",
      },
    ],
  },
  returns: {
    title: "Returns & Refunds Policy",
    eyebrow: "Shopping with confidence",
    description:
      "Find out how to contact us about a product problem, arrange a return, and understand the refund process when shopping with Adya by Anjana.",
    badge: "Returns, remedies and refunds",
    contactTitle: "Need help with a return?",
    contactDescription:
      "Have your order number and relevant product details ready so our team can help you with your return enquiry.",
    contactLabel: "Email our support team",
    sections: [
      {
        id: "faulty-goods",
        label: "01 / Product issues",
        title: "1. Faulty, damaged, incorrect or misdescribed goods",
        content:
          "Contact us with proof of purchase and details of the issue. Photos can help, but an unboxing video is must. We may reasonably assess the goods before deciding the remedy.\n\nFor a major failure, you may reject the goods and choose a refund or replacement. Alternatively, you may keep them and claim compensation for their reduced value. For a minor failure, we will arrange a free remedy within a reasonable time. If we do not remedy it in a reasonable time, further rights may include obtaining a repair elsewhere and recovering reasonable costs, or rejecting the goods and seeking a refund or replacement.",
      },
      {
        id: "return-costs",
        label: "02 / Return postage",
        title: "3. Return costs for a product problem",
        content:
          "Please contact us for return arrangements. If the product fails to meet a consumer guarantee, we pay reasonable return costs and provide any refund of original delivery charges required by law.",
      },
      {
        id: "how-to-return",
        label: "03 / Return process",
        title: "4. How to return an item",
        content:
          "Email support@adyabyanjana.com.au with your order number or other reasonable proof of purchase, the item and your reason for return.\n\nTracking is recommended so the parcel can be located; postage insurance is optional. Keep your postage receipt. Contacting us first helps us process your return, but lack of prior authorisation does not itself remove a statutory entitlement.",
      },
      {
        id: "refunds-exchanges",
        label: "04 / Refund processing",
        title: "6. Refunds and exchanges",
        content:
          "We aim to inspect returns and process an approved refund within 5 business days after receipt, or sooner where legally required. Refunds go to the original payment method unless we agree otherwise. Your provider may take additional time to display the credit.",
      },
    ],
  },
};

const POLICY_TABS = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "returns", label: "Returns & Refunds" },
];

function Field({ label, value, onChange, multiline = false }) {
  const className =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B49A68]";

  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-gray-700">
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={5}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

export default function PoliciesSettings() {
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [activeTab, setActiveTab] = useState("privacy");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPolicies() {
      try {
        const response = await getSetting("site.policies");

        if (active && response?.value) {
          const saved = response.value;

          setPolicies({
            ...DEFAULT_POLICIES,
            ...saved,
            privacy: {
              ...DEFAULT_POLICIES.privacy,
              ...saved.privacy,
              sections: saved.privacy?.sections || DEFAULT_POLICIES.privacy.sections,
            },
            terms: {
              ...DEFAULT_POLICIES.terms,
              ...saved.terms,
              sections: saved.terms?.sections || DEFAULT_POLICIES.terms.sections,
            },
            returns: {
              ...DEFAULT_POLICIES.returns,
              ...saved.returns,
              sections: saved.returns?.sections || DEFAULT_POLICIES.returns.sections,
            },
          });
        }
      } catch (err) {
        if (active && err?.response?.status !== 404) {
          setError(
            err?.response?.data?.message || "Unable to load policy settings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPolicies();

    return () => {
      active = false;
    };
  }, []);

  const currentPolicy = policies[activeTab];

  function updatePolicy(field, value) {
    setPolicies((current) => ({
      ...current,
      [activeTab]: {
        ...current[activeTab],
        [field]: value,
      },
    }));
    setError("");
    setSuccess("");
  }

  function updateSection(index, field, value) {
    setPolicies((current) => ({
      ...current,
      [activeTab]: {
        ...current[activeTab],
        sections: current[activeTab].sections.map((section, sectionIndex) =>
          sectionIndex === index
            ? { ...section, [field]: value }
            : section
        ),
      },
    }));
    setError("");
    setSuccess("");
  }

  function addSection() {
    const nextIndex = currentPolicy.sections.length + 1;

    updatePolicy("sections", [
      ...currentPolicy.sections,
      {
        id: `section-${Date.now()}`,
        label: `${String(nextIndex).padStart(2, "0")} / New section`,
        title: "New section heading",
        content: "",
      },
    ]);
  }

  function removeSection(index) {
    updatePolicy(
      "sections",
      currentPolicy.sections.filter((_, sectionIndex) => sectionIndex !== index)
    );
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSetting("site.policies", policies);
      setSuccess("Policy settings saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to save policy settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-8 text-sm text-gray-500">
        Loading policy settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex flex-wrap gap-2">
          {POLICY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                setSuccess("");
              }}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#493829] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Page information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Edit the heading and introduction displayed at the top of this policy.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Page title"
            value={currentPolicy.title}
            onChange={(value) => updatePolicy("title", value)}
          />
          <Field
            label="Eyebrow label"
            value={currentPolicy.eyebrow}
            onChange={(value) => updatePolicy("eyebrow", value)}
          />
          <div className="md:col-span-2">
            <Field
              label="Introduction"
              multiline
              value={currentPolicy.description}
              onChange={(value) => updatePolicy("description", value)}
            />
          </div>
          <Field
            label="Small badge text"
            value={currentPolicy.badge}
            onChange={(value) => updatePolicy("badge", value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Policy sections
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Edit section labels, headings and content. Use a new line to separate paragraphs.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add section
          </button>
        </div>

        {currentPolicy.sections.map((section, index) => (
          <div
            key={section.id}
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-gray-800">
                Section {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <Field
              label="Section navigation label"
              value={section.label}
              onChange={(value) => updateSection(index, "label", value)}
            />
            <Field
              label="Section heading"
              value={section.title}
              onChange={(value) => updateSection(index, "title", value)}
            />
            <Field
              label="Section content"
              multiline
              value={section.content}
              onChange={(value) => updateSection(index, "content", value)}
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-5 text-base font-semibold text-gray-900">
          Contact callout
        </h3>
        <div className="grid gap-5">
          <Field
            label="Callout heading"
            value={currentPolicy.contactTitle}
            onChange={(value) => updatePolicy("contactTitle", value)}
          />
          <Field
            label="Callout description"
            multiline
            value={currentPolicy.contactDescription}
            onChange={(value) => updatePolicy("contactDescription", value)}
          />
          <Field
            label="Callout link label"
            value={currentPolicy.contactLabel}
            onChange={(value) => updatePolicy("contactLabel", value)}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#493829] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#35291f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save All Policies"}
        </button>
      </div>
    </form>
  );
}
