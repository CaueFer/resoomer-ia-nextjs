import { cn } from "@/lib/utils";
import { Bot, ShieldX, User } from "lucide-react";

interface MessageProps {
  content: string;
  isUserMessage?: boolean;
  isErrorMessage?: boolean;
  isLoadingMessage?: boolean;
}

export const Message = ({
  content,
  isUserMessage = false,
  isErrorMessage = false,
}: MessageProps) => {
  return (
    <div
      className={cn({
        "bg-zing-800": isUserMessage,
        "bg-zing-900/25": !isUserMessage,
      })}
    >
      <div className="p-6">
        <div
          className={cn("max-w-3xl mx-auto flex items-start gap-2.5", {
            "flex-row-reverse": isUserMessage,
          })}
        >
          <div
            className={cn(
              "size-10 shrink-0 aspect-square rounded-full border border-zinc-700 bg-zinc-900 flex justify-center items-center",
              {
                "bg-blue-950 border-blue-700 text-zinc-200": isUserMessage,
              }
            )}
          >
            {isUserMessage ? (
              <User className="size-5" />
            ) : isErrorMessage ? (
              <ShieldX className="size-5 text-red-500" />
            ) : (
              <Bot className="size-5 text-white" />
            )}
          </div>

          <div
            className={cn("flex flex-col justify-end w-auto p-4", {
              "items-end mr-6 bg-[#3F3F46] rounded-md": isUserMessage,
              "items-start ml-6": !isUserMessage,
            })}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {isUserMessage ? "Você" : "Website"}
              </span>
            </div>

            <div className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
              {content === "loading" ? (
                <section className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </section>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
