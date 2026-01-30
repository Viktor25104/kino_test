export class ReserveTicketCommand {
    constructor(
        public readonly eventId: number,
        public readonly userId: number,
        public readonly seat: string,
        public readonly email: string,
    ) { }
}
