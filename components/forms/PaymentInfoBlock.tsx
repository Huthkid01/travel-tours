import { APPOINTMENT_FEE_INFO } from "@/data/darboi-application-form";

export function PaymentInfoBlock() {
  return (
    <div className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-4 text-sm text-navy-800 dark:text-navy-200">
      <p className="font-semibold uppercase tracking-wide text-navy-900 dark:text-white">
        Appointment fees for procurement
      </p>
      <ul className="mt-3 space-y-1.5 leading-relaxed">
        <li>
          <span className="font-medium">Fee:</span> {APPOINTMENT_FEE_INFO.amountLabel}
        </li>
        <li>
          <span className="font-medium">Bank:</span> {APPOINTMENT_FEE_INFO.bankName}
        </li>
        <li>
          <span className="font-medium">Account number:</span>{" "}
          <span className="font-mono text-gold-700 dark:text-gold-400">
            {APPOINTMENT_FEE_INFO.accountNumber}
          </span>
        </li>
        <li>
          <span className="font-medium">Account name:</span> {APPOINTMENT_FEE_INFO.accountName}
        </li>
      </ul>
      <p className="mt-3 text-xs text-navy-600 dark:text-navy-400">
        After payment, enter your transfer reference or depositor name below.
      </p>
    </div>
  );
}
