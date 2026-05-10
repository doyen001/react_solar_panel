import Icon from "@/components/ui/Icons";
import {
  USER_MANUAL_PAGE,
  type UserManualBlock,
} from "@/utils/constant";

function UserManualBlockView({ block }: { block: UserManualBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="font-source-sans text-base leading-[1.6] text-user-manual-body">
          {block.text}
        </p>
      );
    case "list_intro":
      return (
        <p className="font-source-sans text-base leading-[1.6] text-user-manual-body">
          {block.text}
        </p>
      );
    case "bullet_list":
      return (
        <ul className="grid gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 font-source-sans text-base leading-[1.6] text-user-manual-body"
            >
              <span className="inline-flex shrink-0" aria-hidden>
                <Icon
                  name="BulletDot"
                  className="mt-[0.55em] h-1.5 w-1.5 text-user-manual-bullet"
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export function UserManualPageSection() {
  return (
    <section>
      <div className="pt-30 md:pt-36">
        <h1 className="mb-10 text-center font-source-sans text-4xl font-bold leading-tight tracking-tight text-user-manual-title md:mb-12 lg:text-5xl">
          {USER_MANUAL_PAGE.title}
        </h1>
        <div className="space-y-4">
          {USER_MANUAL_PAGE.blocks.map((block, index) => (
            <UserManualBlockView
              key={`${block.type}-${index}`}
              block={block}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
