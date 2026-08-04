import type INoteContent from "~/utils/models/INoteContent";
import type { IListItemData } from "./ListItemComponent.props";

export interface ListComponentProps {
	items: INoteContent[];
	layout?: "grid" | "list";
	paginate?: boolean;
	onItemClicked?: (data: IListItemData) => void;
}
