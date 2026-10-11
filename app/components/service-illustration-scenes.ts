/**
 * Masks use the originals' 1254 × 1254 reference space. They select the actual
 * raster artwork, including its paper fills; no illustration is redrawn.
 * The blank top 240 units of each original supply paper beneath moving pieces.
 */
export type IllustrationKind =
  | "satellite" | "tailoring" | "clarity" | "automation"
  | "conversation" | "prototype" | "launch";

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
  /** Looping scenes: pulses per cycle. Whole numbers keep the loop seamless. */
  cycles?: number;
  /**
   * Travels once around this ellipse per cycle, starting where it rests, and
   * shrinks towards the far side. Direction -1 turns the way the clock does not.
   */
  orbit?: { center: [number, number]; radii: [number, number]; tilt: number; depth: number; direction: 1 | -1 };
};

/** Ink hidden from the original, then drawn back along its strokes. */
export type IllustrationReveal = {
  id: string;
  area: string;
  /** Each stroke draws over its share [from, to] of the reveal. */
  strokes: { d: string; from: number; to: number }[];
  width: number;
  /** The part of the cycle the drawing occupies. */
  start: number;
  end: number;
};

export type IllustrationScene = {
  layers: IllustrationLayer[];
  /** Small occluded stationary edges, visible only through the cutout holes. */
  repairs?: { path: string; fill?: string; stroke?: string; width?: number; dash?: string }[];
  reveals?: IllustrationReveal[];
  /** Seconds per cycle; 1.6 when omitted. */
  duration?: number;
  /** With trigger "view": keep looping while in view instead of playing once. */
  loop?: boolean;
  /** Ink removed while the scene plays, covered by paper. */
  erase?: string[];
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
  // The approach images play once as they scroll into view, not on hover.
  conversation: {
    duration: 3.2,
    layers: [
      { id: "clear-bubble", path: "M618 500 Q616 436 674 410 Q740 384 851 386 Q930 392 948 440 Q966 500 942 548 Q915 600 874 610 L826 614 L762 664 L754 628 Q694 624 642 576 Q616 540 618 500 Z", pivot: [766, 640], y: -26, rotate: 2.5, delay: 0.5 },
      { id: "star", path: "M668 296 L726 296 L726 377 L668 377 Z", pivot: [697, 336], rotate: 35, delay: 0.6 },
      { id: "spark-left", path: "M624 298 L654 298 L654 335 L624 335 Z", x: -10, y: -10, delay: 0.62 },
      { id: "spark-right", path: "M758 342 L795 342 L795 378 L758 378 Z", x: 10, y: -8, delay: 0.62 },
      { id: "dash", path: "M334 535 L375 535 L375 562 L334 562 Z", x: -10, y: 4, delay: 0.1 },
      // Slides along its own axis, so the notebook edges beneath never show.
      { id: "pencil", path: "M762 906 L797 846 L966 718 L1012 683 Q1030 680 1042 696 Q1048 712 1038 728 L1004 757 L832 885 Z", x: -14, y: 12 },
    ],
    // The tangled thought is drawn in first, then the clear bubble answers it.
    // Strokes follow the ink's skeleton from its free end; where the walk
    // broke at a crossing, the next stroke starts at the nearest loose end.
    reveals: [{
      id: "tangle",
      area: "M410 470 Q410 400 470 380 L560 378 Q612 386 622 430 L628 470 L627 494 Q600 505 560 512 Q520 548 470 547 Q412 540 410 470 Z",
      width: 7,
      start: 0.02,
      end: 0.55,
      strokes: [
        { d: "M563 414 L556 418 L542 423 L529 426 L520 426 L519 427 L508 428 L505 431 L501 431 L499 433 L494 433 L491 435 L486 436 L478 441 L473 441 L468 439 L453 440 L442 445 L431 454 L426 460 L422 468 L421 487 L425 495 L432 502 L438 505 L447 507 L448 506 L456 506 L472 499 L473 496 L480 489 L489 494 L495 494 L510 480 L510 475 L508 473 L505 465 L497 457 L496 454 L487 446 L482 444 L479 441", from: 0.0, to: 0.223 },
        { d: "M473 442 L469 447 L462 451 L462 454 L458 457 L449 472 L445 487 L445 504 L446 505", from: 0.223, to: 0.271 },
        { d: "M446 507 L448 515 L452 523 L463 534 L474 538 L484 538 L493 535 L506 522 L510 511 L512 501 L512 486 L510 480", from: 0.271, to: 0.353 },
        { d: "M511 475 L518 473 L522 469 L525 462 L527 452 L529 449 L528 438 L527 437 L528 436 L527 427", from: 0.353, to: 0.39 },
        { d: "M526 425 L523 417 L512 406 L514 402 L525 392 L539 386 L547 386 L559 391 L571 404 L576 417 L576 423 L578 429 L578 438 L577 439 L577 446 L575 451 L574 463 L576 473 L580 480 L589 488 L602 491 L614 490 L627 485", from: 0.39, to: 0.538 },
        { d: "M599 465 L605 452 L605 441 L602 433 L592 424 L587 422 L577 422", from: 0.538, to: 0.579 },
        { d: "M575 423 L573 423 L565 428 L556 438 L552 448 L550 469 L548 471 L547 475 L544 477 L543 481 L532 492 L522 496 L513 497", from: 0.579, to: 0.648 },
        { d: "M511 497 L501 497 L495 494", from: 0.648, to: 0.659 },
        { d: "M489 494 L483 498 L475 500 L473 499", from: 0.659, to: 0.671 },
        { d: "M475 501 L476 506 L486 516 L503 523", from: 0.671, to: 0.695 },
        { d: "M506 523 L519 523 L527 521 L535 517 L542 510 L548 496 L549 484 L547 475", from: 0.695, to: 0.745 },
        { d: "M547 471 L541 458 L529 450", from: 0.745, to: 0.764 },
        { d: "M528 447 L514 447 L506 449 L500 452 L497 452", from: 0.764, to: 0.784 },
        { d: "M495 455 L491 457 L478 470 L472 480 L473 481 L472 485 L472 494 L473 495", from: 0.784, to: 0.817 },
        { d: "M472 480 L465 469 L462 459 L462 455", from: 0.817, to: 0.835 },
        { d: "M462 450 L462 440", from: 0.835, to: 0.841 },
        { d: "M463 438 L463 433 L468 421 L479 409 L491 403 L504 403 L511 406", from: 0.841, to: 0.886 },
        { d: "M510 407 L502 421 L501 430", from: 0.886, to: 0.902 },
        { d: "M499 434 L497 439 L497 451", from: 0.902, to: 0.914 },
        { d: "M497 458 L498 467 L503 472 L507 473 L509 475", from: 0.914, to: 0.929 },
        { d: "M516 480 L519 483 L522 484 L528 484 L529 485 L537 484 L538 485", from: 0.929, to: 0.944 },
        { d: "M550 457 L538 448 L530 447", from: 0.944, to: 0.959 },
        { d: "M527 437 L516 433 L506 431", from: 0.959, to: 0.974 },
        { d: "M559 467 L567 472 L575 473", from: 0.974, to: 0.985 },
        { d: "M578 474 L588 472 L599 465", from: 0.985, to: 1.0 },
      ],
    }],
    // The tangled bubble's outline, hidden behind the clear bubble until it lifts.
    repairs: [{ path: "M668 430 Q664 490 628 518", stroke: "#141a30", width: 3 }],
  },
  prototype: {
    layers: [
      { id: "wireframe", path: "M218 328 L420 272 L508 498 L292 563 Z", pivot: [360, 420], x: -12, y: -22, rotate: -4 },
      { id: "ripple-upper", path: "M690 658 Q705 652 717 661 Q730 673 731 690 L723 693 Q720 681 712 688 L706 686 Q705 678 698 674 L696 664 Z", x: 9, y: -9, delay: 0.18 },
      { id: "ripple-lower", path: "M655 718 L662 712 L672 714 Q682 722 690 726 L693 734 Q697 742 694 748 L686 750 Q668 744 657 728 Z", x: -9, y: 9, delay: 0.18 },
      { id: "star", path: "M846 395 L900 395 L900 455 L846 455 Z", pivot: [873, 424], rotate: 35, delay: 0.3 },
    ],
  },
  launch: {
    // Loops while in view: one revolution of the satellite per cycle.
    duration: 14,
    loop: true,
    // The speed line under the satellite's resting place reads as a stray mark
    // once the satellite has moved on.
    erase: ["M740 824 L820 824 L820 850 L740 850 Z"],
    layers: [
      // First, so the capsule hides it on the far side of the orbit. The orbit
      // is fitted to the drawn line's pixels.
      { id: "satellite", path: "M796 734 L860 752 Q872 738 884 742 L894 704 Q893 692 904 692 Q917 694 914 709 L906 748 Q917 754 914 767 L926 770 L935 774 L932 784 L960 794 Q969 796 966 807 L953 844 Q947 851 936 847 L900 836 Q870 836 852 824 Q838 812 834 808 L826 807 L823 799 L800 790 Q789 786 790 776 Z", pivot: [880, 790], orbit: { center: [628, 693.4], radii: [387.9, 120.3], tilt: 3.97, depth: 0.25, direction: -1 } },
      // Bobs above its exhaust lines, never below its resting place.
      { id: "capsule", path: "M494 440 Q498 420 520 420 L742 457 Q762 465 758 490 L728 640 L753 702 Q757 720 746 750 L728 752 L697 720 Q676 752 638 750 L500 728 Q474 720 474 702 L458 678 L418 685 Q401 681 407 664 L438 612 Q452 594 474 580 Z", pivot: [610, 590], y: -22, rotate: -1.5, cycles: 5 },
      { id: "star-left", path: "M360 466 L420 466 L420 536 L360 536 Z", pivot: [390, 501], rotate: 35, cycles: 3, delay: 0.15 },
      { id: "star-right", path: "M838 500 L892 500 L892 564 L838 564 Z", pivot: [864, 532], rotate: -35, cycles: 3, delay: 0.65 },
    ],
    // The orbit runs on behind the satellite's resting place.
    repairs: [{ path: "M822 806 Q885 797 932 772", stroke: "#141a30", width: 2.5 }],
  },
};
