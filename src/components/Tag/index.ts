import TagGroup from "./TagGroup.vue"
import Tag from "./Tag.vue"

type Variant =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "pending"
    | "danger"
    | "dark"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-warning"
    | "outline-pending"
    | "outline-danger"
    | "outline-dark"
    | "soft-primary"
    | "soft-secondary"
    | "soft-success"
    | "soft-warning"
    | "soft-pending"
    | "soft-danger"
    | "soft-dark"
    | "facebook"
    | "twitter"
    | "instagram"
    | "linkedin";

type Size = 'large' | 'default' | 'small' | 'extra-small'
export {TagGroup, Tag, Variant, Size};