type Row = {
  id: number;
  title: string;
  author_name: string;
  is_available: boolean;
  added_at: number;
};

type ResponseShape = Omit<Row, "is_available" | "author_name" | "added_at"> & {
  authorName: string;
  addedAt: number;
};

// It is pure, because it only depends on its input and causes no side effects (only depends on its own arguments, and not on external state)
// Side effects such as database writes, reading from the database, logging, or sending the HTTP response belong in the Express layer
// that handles I/O, usually the controller or route handler, while the transformation itself can live in a service or helper function.
// It would also be not pure if the same input would return a different result when for example it would use Date.now() or Math.random()
function availableBooks(rows: Row[]): ResponseShape[] {
  return rows
    .filter((row) => row.is_available)
    .map((row) => ({
      id: row.id,
      title: row.title,
      authorName: row.author_name,
      addedAt: row.added_at,
    }));
}

class BookReservation {
  #reservationStatus: "reserved" | "returned" | "cancelled";

  constructor(
    public memberName: string,
    public bookTitle: string,
  ) {
    this.#reservationStatus = "reserved";
  }

  public markReturned(): void {
    if (
      this.#reservationStatus === "returned" ||
      this.#reservationStatus === "cancelled"
    ) {
      throw new Error("Reservation is already returned or cancelled");
    }

    this.#reservationStatus = "returned";
  }

  public cancel(): void {
    if (this.#reservationStatus === "returned") {
      throw new Error("The book has already been returned");
    }

    this.#reservationStatus = "cancelled";
  }

  get reservationStatus(): "reserved" | "returned" | "cancelled" {
    return this.#reservationStatus;
  }
}

interface Notifiable {
  // sends a notification to a member
  notify(memberId: string, event: string, title: string): void;
  // returns the name of the channel (e.g. "email")
  getChannelName(): string;
}

abstract class BaseNotifier implements Notifiable {
  getChannelName(): string {
    return "email";
  }
  // returns a full message string, e.g. "Reminder: 'Dune' is overdue." or "Your reservation for 'Dune' is confirmed."
  formatMessage(event: "reservation" | "overdue", title: string): string {
    switch (event) {
      case "reservation":
        return `Reminder: "${title}" is overdue.`;
      case "overdue":
        return `Your reservation for "${title}" is confirmed`;
    }
  }
  abstract send(memberId: string, message: string): void;
  notify(
    memberId: string,
    event: "reservation" | "overdue",
    title: string,
  ): void {
    this.send(memberId, this.formatMessage(event, title));
  }
}

class EmailNotifier extends BaseNotifier {
  send(memberId: string, message: string): void {
    console.log(`Sending email to member #${memberId}: ${message}`);
  }
}

class SmsNotifier extends BaseNotifier {
  send(memberId: string, message: string): void {
    console.log(`Sending SMS to member #${memberId}: ${message}`);
  }
}

class NotificationService {
  constructor(public channels: Notifiable[]) {}

  dispatch(
    memberId: string,
    event: "reservation" | "overdue",
    title: string,
  ): void {
    this.channels.forEach((channel) => channel.notify(memberId, event, title));
  }
}

const emailNotifier = new EmailNotifier();
const smsNotifier = new SmsNotifier();
const notificationService = new NotificationService([
  emailNotifier,
  smsNotifier,
]);
notificationService.dispatch("42", "reservation", "Dune");
