import type { EventBusType } from "~/utils/interfaces/IEventBus";
import type { NoteContentType } from "~/utils/models/INoteContent";

export interface MarkdownContentComponentProps {
    page: NoteContentType;
}

export class ListItemEventName {
    static OnItemClicked: EventBusType = "item-clicked-event";
}
