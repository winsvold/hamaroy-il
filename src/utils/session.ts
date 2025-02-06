import add from "date-fns/add";
import { Session } from "../../sanity.types";

export const getSessionEndsAt = (session: Session) => {
  const { duration, startsAt } = session;

  if (!startsAt || !duration) throw new Error("Missing startsAt or duration");

  return add(new Date(startsAt), duration);
};
