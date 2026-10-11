/**
 * Masks use the originals' 1254 × 1254 reference space. They select the actual
 * raster artwork, including its paper fills; no illustration is redrawn.
 * The blank top 240 units of each original supply paper beneath moving pieces.
 */
export type IllustrationKind = "satellite" | "tailoring" | "clarity" | "automation";

export type IllustrationLayer = {
  id: string;
  path: string;
  pivot?: [number, number];
  x?: number;
  y?: number;
  rotate?: number;
  scaleY?: number;
  delay?: number;
  float?: boolean;
};

export type IllustrationScene = {
  layers: IllustrationLayer[];
  /** Small occluded stationary edges, visible only through the cutout holes. */
  repairs?: { path: string; fill?: string; stroke?: string; width?: number; dash?: string }[];
};

export const illustrationScenes: Record<IllustrationKind, IllustrationScene> = {
  satellite: {
    layers: [
      { id: "orders", path: "M303 340 Q303 329 320 326 L484 296 Q511 292 514 319 L541 450 Q545 474 525 480 L357 517 Q329 522 325 497 Z", x: 22, y: -10, rotate: 1.5, pivot: [421, 407], delay: 0.06 },
      { id: "mail", path: "M759 378 L853 412 L833 476 L738 443 Z", x: 20, y: 12, rotate: -2, pivot: [795, 427], delay: 0.15 },
      { id: "calendar", path: "M304 744 Q310 733 328 737 L477 772 Q490 779 487 797 L474 923 Q474 939 457 937 L302 898 Q287 894 289 874 Z", x: -20, y: -9, rotate: -1.5, pivot: [388, 837], delay: 0.1 },
      { id: "tasks", path: "M942 646 Q947 631 964 636 L1088 678 Q1108 684 1104 702 L1071 835 Q1067 852 1049 847 L922 802 Q910 796 913 780 Z", x: -18, y: 12, rotate: 1.5, pivot: [1009, 743], delay: 0.2 },
      { id: "left-wing", path: "M405 613 L469 571 Q478 568 488 572 L550 594 Q559 598 557 610 L534 624 L563 632 L559 649 L526 637 L500 656 Q489 660 477 655 L406 633 Z", pivot: [559, 640], rotate: 9, float: true },
      { id: "right-wing", path: "M686 666 L733 681 L759 663 Q768 660 779 664 L849 690 Q858 693 855 705 L802 755 Q792 763 780 758 L703 733 Q696 729 699 718 L718 699 L684 688 Z", pivot: [692, 680], rotate: -9, delay: 0.1, float: true },
      { id: "body", path: "M652 521 Q652 507 666 507 Q679 511 675 524 L654 578 Q663 578 669 586 L680 597 Q722 610 717 641 L706 695 Q702 730 680 745 Q647 766 590 746 Q541 735 544 691 L557 621 Q566 590 604 582 L616 582 L635 568 L648 524 Z", float: true },
    ],
    repairs: [{ path: "M312 767 C55 527 243 346 641 391 C1039 407 1210 689 923 847 C791 938 584 930 480 871", stroke: "#1c293b", width: 2, dash: "8 13" }],
  },
  tailoring: {
    layers: [
      { id: "thread", path: "M791 433 C818 456 837 495 826 523 C818 545 795 553 772 550 L730 540 Q709 526 691 552 L685 547 Q705 518 733 532 L775 542 Q806 547 818 521 Q836 488 786 436 Z", pivot: [696, 560], rotate: -5, y: -14 },
      { id: "needle-hand", path: "M727 416 Q739 366 778 339 L808 317 Q823 312 839 320 L898 336 Q920 346 939 372 L980 418 L998 425 L998 444 L974 507 L958 506 L860 479 L800 452 L774 434 L750 430 Z M749 413 L764 418 L700 570 L686 571 Z", pivot: [696, 560], rotate: -5, y: -14 },
      { id: "tape-tail", path: "M833 782 Q877 812 981 828 L976 865 Q885 850 834 818 Z", pivot: [837, 803], rotate: 7, delay: 0.18 },
    ],
    repairs: [
      { path: "M718 441 L748 447 L823 744", stroke: "#1b2939", width: 2.5 },
      { path: "M688 551 L738 537 L746 553 L696 566 Z", fill: "#2851d5" },
    ],
  },
  clarity: {
    layers: [
      { id: "calendar-sheet", path: "M174 413 L303 372 Q326 456 376 522 L243 557 Q199 489 174 413 Z", x: 20, y: 9, rotate: 2, pivot: [275, 471], delay: 0.08 },
      { id: "chart-sheet", path: "M165 554 Q232 581 301 587 Q293 659 266 726 Q180 719 109 685 Z", x: 22, y: -6, rotate: -2, pivot: [205, 641], delay: 0.14 },
      { id: "parcel-sheet", path: "M242 744 L372 696 Q393 757 435 821 L298 882 Q264 817 242 744 Z", x: 18, y: -12, rotate: 2, pivot: [337, 789], delay: 0.2 },
      { id: "lens", path: "M466 620 A151 151 0 1 1 768 620 A151 151 0 1 1 466 620 Z M530 743 L572 761 L508 872 Q494 889 474 876 L461 865 Q454 854 465 834 L497 775 Q506 755 530 743 Z", pivot: [617, 622], rotate: 5, x: 18, y: -10 },
      { id: "dashboard-bar", path: "M1060 607 L1086 613 L1083 680 L1059 674 Z", pivot: [1072, 677], scaleY: 0.22, delay: 0.2 },
    ],
  },
  automation: {
    layers: [
      { id: "upper-sheet", path: "M216 373 L312 349 Q328 424 396 466 L309 496 Q248 466 216 373 Z", x: 24, y: 20 },
      { id: "lower-sheet", path: "M161 503 L238 473 Q289 527 357 547 L299 597 Q222 585 161 503 Z", x: 26, y: 14, delay: 0.12 },
      { id: "feed-sheet", path: "M367 511 L462 507 Q484 568 542 612 L472 638 Q406 616 367 511 Z", pivot: [477, 611], rotate: -3, x: 9, y: 10, delay: 0.22 },
      { id: "gear", path: "M654 718 A51 55 0 1 0 756 718 A51 55 0 1 0 654 718 Z", pivot: [705, 718], rotate: 65 },
      { id: "winding-key", path: "M409 705 Q435 703 451 720 Q473 738 471 753 L493 752 Q507 739 520 739 L523 783 Q507 794 493 778 L474 780 Q473 813 448 829 Q423 834 410 816 Q401 802 409 782 L416 758 Q393 741 409 705 Z", pivot: [505, 764], rotate: -16, delay: 0.05 },
      { id: "finished-sheet", path: "M834 762 L955 744 Q974 802 1027 851 L933 865 Q873 858 834 762 Z", x: 26, y: 8, delay: 0.24 },
    ],
    repairs: [
      { path: "M421 809 L420 861 Q420 872 442 877", stroke: "#243140", width: 2.5 },
      { path: "M469 644 L535 645 L541 596 Q542 564 525 563 Q508 564 496 584 Z", fill: "#25303e" },
      { path: "M834 812 L834 762 Q829 734 847 727 L875 724 L869 843 L842 843 Z", fill: "#25303e" },
      { path: "M853 834 L1080 839", stroke: "#243140", width: 3 },
    ],
  },
};
