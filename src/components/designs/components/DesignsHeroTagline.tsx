type DesignsHeroTaglineProps = {
  className?: string;
};

export function DesignsHeroTagline({ className }: DesignsHeroTaglineProps) {
  return (
    <p
      className={`w-full text-center font-source-sans text-[clamp(20px,2.8vw,26px)] font-extrabold leading-normal text-white ${className ?? ""}`}
      style={{ letterSpacing: "0.248px" }}
    >
      We design to maximise your savings and end your energy bills.
    </p>
  );
}
