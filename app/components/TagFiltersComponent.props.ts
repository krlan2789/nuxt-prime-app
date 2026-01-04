import type { EventBusType } from "~/utils/interfaces/IEventBus";

export interface TagFiltersComponentProps {
	tags: string[];
	initialSelectedTags?: Set<string>;
	forceExapand?: boolean;
	onSelected?: (tags: string[]) => void;
	onSearch?: (keyword: string) => void;
}

export class TagFiltersEventName {
	static OnTagSelected: EventBusType = "tag-selected-event";
}
