import type { EventBusType } from "~/utils/interfaces/IEventBus";

export interface IListItemData {
	slug: string;
	title: string;
	description?: string;
	tags?: string[];
	date?: string;
}

export interface ListItemComponentProps extends IListItemData {
	index?: number;
	onItemClicked?: (data: IListItemData) => void;
}

export class ListItemEventName {
	static OnItemClicked: EventBusType = "item-clicked-event";
}
