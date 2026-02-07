import type { ReactNode } from "react";
import Card from "./Card";
import MessagePanel from "./MessagePanel";

type FeedbackCardProps = {
  title: string;
  message: ReactNode;
  role?: "status" | "alert";
};

export default function FeedbackCard({
  title,
  message,
  role
}: FeedbackCardProps) {
  return (
    <Card>
      <MessagePanel title={title} role={role}>
        {message}
      </MessagePanel>
    </Card>
  );
}
