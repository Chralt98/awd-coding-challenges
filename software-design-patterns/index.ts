function getMockDB() {
  return {
    query(select: string): Log[] {
      return [
        {
          timestamp: "2026-05-19T10:00:00.000Z",
          level: "info",
          message: "lorem",
        },
        {
          timestamp: "2026-05-19T10:01:00.000Z",
          level: "warn",
          message: "ipsum",
        },
        {
          timestamp: "2026-05-19T10:02:00.000Z",
          level: "error",
          message: "dolor",
        },
      ];
    },
  };
}

class LogExporter {
  constructor(private readonly logRepo: LogRepository) {}

  async exportLogs(format: "json" | "csv" | "xml") {
    const logs = await this.logRepo.getLogs();
    const formatter = ExporterFactory.create(format);

    return formatter.format(logs);
  }
}

export interface Log {
  timestamp: string;
  level: string;
  message: string;
}

export interface LogRepository {
  getLogs(): Promise<Log[]>;
}

class MockLogRepository implements LogRepository {
  private readonly db = getMockDB();

  async getLogs(): Promise<Log[]> {
    return this.db.query("SELECT * FROM system_logs");
  }
}

interface LogFormatter {
  format(logs: Log[]): string;
}

class JsonFormatter implements LogFormatter {
  format(logs: Log[]): string {
    return JSON.stringify(logs);
  }
}

class CsvFormatter implements LogFormatter {
  format(logs: Log[]): string {
    return logs.map((l) => `${l.timestamp},${l.level},${l.message}`).join("\n");
  }
}

class XmlFormatter implements LogFormatter {
  format(logs: Log[]): string {
    return `<logs>${logs.map((l) => `<log>${l.message}</log>`).join("")}</logs>`;
  }
}

class ExporterFactory {
  static create(format: "json" | "csv" | "xml"): LogFormatter {
    switch (format) {
      case "json":
        return new JsonFormatter();
      case "csv":
        return new CsvFormatter();
      case "xml":
        return new XmlFormatter();
      default:
        throw new Error("Unknown format");
    }
  }
}

const logRepository = new MockLogRepository();
const exporter = new LogExporter(logRepository);

void exporter.exportLogs("json");
