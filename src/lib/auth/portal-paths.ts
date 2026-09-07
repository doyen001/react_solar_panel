/**
 * Portal entry points, shared by the code that *sends* someone to sign in and
 * the code that decides where to put them afterwards. Keeping the two in one
 * place is what stops them drifting apart.
 */

export const CUSTOMER_AUTH_PATH = "/customers/auth";

/** Where a customer lands after signing in with no return path to honour. */
export const CUSTOMER_HOME_PATH = "/customers/dashboard";
