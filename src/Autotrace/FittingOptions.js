import {Color} from './Color'

export type FittingOptions = {|
    background_color?: Color;
    charcode?: number;
    color_count?: number;
    corner_always_threshold?: number;
    corner_surround?: number;
    corner_threshold?: number;
    error_threshold?: number;
    filter_iterations?: number;
    line_reversion_threshold?: number;
    line_threshold?: number;
    remove_adjacent_corners?: boolean;
    tangent_surround?: number;
    despeckle_level?: number;
    despeckle_tightness?: number;
    noise_removal?: number;
    centerline: boolean;
    preserve_width?: boolean;
    width_weight_factor: ? number;
|}
