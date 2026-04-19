"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { forwardRef, useImperativeHandle, useState } from "react";
import { DESIGNS_REGISTER_STEP } from "@/utils/constant";

type RegisterFormState = {
  name: string;
  email: string;
  phone: string;
};

export type DesignsRegisterStepValue = RegisterFormState;

export type DesignsRegisterStepHandle = {
  getValues: () => DesignsRegisterStepValue;
};

/**
 * Figma 3:4109 — intro panel + contact form for the Register step.
 */
export const DesignsRegisterStepContent = forwardRef<
  DesignsRegisterStepHandle,
  object
>(function DesignsRegisterStepContent(_, ref) {
  const defaults = DESIGNS_REGISTER_STEP.defaultValues;
  const [name, setName] = useState<string>(defaults.name);
  const [email, setEmail] = useState<string>(defaults.email);
  const [phone, setPhone] = useState<string>(defaults.phone);

  useImperativeHandle(ref, () => ({
    getValues: () => ({ name, email, phone }),
  }));

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[1446px] flex-1 flex-col px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[81px] lg:pt-[37px]">
      <div className="flex w-full max-w-[1278px] flex-1 flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-[58px]">
        <div className="flex h-[525px] w-full max-w-[591px] shrink-0 items-center rounded-[46px] border-[3px] border-design-accent-cyan bg-linear-to-r from-yellow-lemon to-orange-amber px-8 py-12 shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)] sm:px-10 lg:px-[46px] lg:py-[56px]">
          <div className="mx-auto flex w-full max-w-[498px] flex-col items-center gap-[30px] text-center">
            <div className="flex flex-col items-center gap-[23px]">
              <h2
                className="w-full font-source-sans text-[clamp(28px,4.8vw,40px)] font-bold capitalize leading-[1.05] text-white"
                style={{ letterSpacing: "0.248px" }}
              >
                {DESIGNS_REGISTER_STEP.title}
              </h2>
              <p
                className="font-source-sans text-[clamp(20px,2.5vw,22px)] font-normal capitalize leading-[1.35] text-black"
                style={{ letterSpacing: "0.248px" }}
              >
                {DESIGNS_REGISTER_STEP.summaryLines[0]}
                <br />
                {DESIGNS_REGISTER_STEP.summaryLines[1]}
              </p>
            </div>
            <p
              className="font-source-sans text-[clamp(18px,2.3vw,20px)] font-normal capitalize leading-[1.45] text-black"
              style={{ letterSpacing: "0.248px" }}
            >
              {DESIGNS_REGISTER_STEP.description}
            </p>
          </div>
        </div>

        <div className="w-full max-w-[649px] shrink-0 designs-border-gradient rounded-[28px] p-[3px] shadow-[0px_0px_40px_0px_rgba(140,140,140,0.3)]">
          <div className="flex min-h-[525px] w-full h-full items-center rounded-[25px] bg-[linear-gradient(135deg,rgba(48,54,71,0.98)_0%,rgba(33,36,47,0.98)_100%)] px-6 py-10 backdrop-blur-[17.8px] sm:px-10 lg:px-[71px]">
            <form
              className="flex w-full flex-col gap-[26px]"
              onSubmit={(e) => e.preventDefault()}
            >
              {DESIGNS_REGISTER_STEP.fields.map((field) => (
                <label key={field.id} className="flex flex-col gap-[8px]">
                  <span className="font-inter text-[15.531px] font-semibold leading-[22.188px] tracking-[-0.1668px] text-white">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    value={field.id === "name" ? name : email}
                    onChange={(event) =>
                      field.id === "name"
                        ? setName(event.target.value)
                        : setEmail(event.target.value)
                    }
                    className="h-[55.529px] rounded-[11.094px] border border-yellow-lemon bg-transparent px-[17.75px] font-inter text-[17.75px] leading-normal tracking-[-0.3467px] text-white outline-none transition focus:border-yellow-lemon focus:ring-2 focus:ring-yellow-lemon/20 placeholder:text-white/70"
                  />
                </label>
              ))}

              <label className="flex flex-col gap-[8px]">
                <span className="font-inter text-[15.531px] font-semibold leading-[22.188px] tracking-[-0.1668px] text-white">
                  {DESIGNS_REGISTER_STEP.phoneLabel}
                </span>
                <PhoneInput
                  country={DESIGNS_REGISTER_STEP.phoneCountry}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  countryCodeEditable={false}
                  enableSearch={false}
                  placeholder={DESIGNS_REGISTER_STEP.phonePlaceholder}
                  containerClass="designs-phone-field"
                  inputClass="designs-phone-control"
                  buttonClass="designs-phone-button"
                  dropdownClass="designs-phone-dropdown"
                  specialLabel=""
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
