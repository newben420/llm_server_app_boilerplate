export function parseCustomDate(input: string): Date {
    const [datePart, timePart] = input.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second); // month is 0-based
}
