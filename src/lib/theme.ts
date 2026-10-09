import type { CSSProperties } from "react";

// The green + orange + cream gradient used on the whole site
export const pageBackground = `
  radial-gradient(circle at 8% 8%, rgba(120, 180, 125, 0.92) 0%, rgba(120, 180, 125, 0) 28%),
  radial-gradient(circle at 92% 10%, rgba(100, 165, 108, 0.88) 0%, rgba(100, 165, 108, 0) 28%),
  radial-gradient(circle at 5% 92%, rgba(110, 175, 118, 0.85) 0%, rgba(110, 175, 118, 0) 26%),
  radial-gradient(circle at 94% 90%, rgba(95, 160, 102, 0.85) 0%, rgba(95, 160, 102, 0) 26%),
  radial-gradient(circle at 50% 45%, rgba(240, 155, 60, 0.82) 0%, rgba(240, 155, 60, 0) 38%),
  linear-gradient(135deg, #c8e6c9 0%, #e8d5b8 30%, #f0b060 52%, #e8d5b8 72%, #c8e6c9 100%)
`;

// Style for the full page wrapper
export const pageStyle: CSSProperties = {
  minHeight:     "100vh",
  width:         "100%",
  paddingTop:    "130px",
  paddingBottom: "80px",
  paddingLeft:   "16px",
  paddingRight:  "16px",
  overflowX:     "hidden",
  background:    pageBackground,
};

// Style for the frosted cream cards
export const glass: CSSProperties = {
  background:           "rgba(250,248,242,0.86)",
  backdropFilter:       "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border:               "1px solid rgba(255,255,255,0.7)",
  boxShadow:            "0 18px 40px rgba(61,47,29,0.13)",
  borderRadius:         "30px",
};