/**
 * Hidden developer signature for AlphaPrime
 */
export function devSignature() {
  if (typeof window !== "undefined") {
    const signature = `
%c  AlphaPrime Developer Signature  %c

  Developer : Santhosh Ravi
  Brand     : AlphaPrime
  Site      : alphaprime.co.in
    `;

    console.log(
      signature,
      "color: #ffffff; background: #6366f1; font-weight: bold; font-size: 14px; padding: 4px 0; border-radius: 4px;",
      "color: #6366f1; font-weight: normal; font-size: 12px;"
    );
  }
}
