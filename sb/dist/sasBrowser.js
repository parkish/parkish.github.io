"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @internal
 * @ignore
 * @param {string} secret
 * @param {string} stringToSign
 * @returns {Promise<string>}
 */
function generateKey(secret, stringToSign) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = yield window.crypto.subtle.importKey("raw", convertToUint8Array(secret), {
            name: "HMAC",
            hash: { name: "SHA-256" }
        }, false, ["sign"]);
        const signature = yield window.crypto.subtle.sign("HMAC", key, stringToSign);
        const base64encodedString = encodeByteArray(new Uint8Array(signature));
        return base64encodedString;
    });
}
/**
 * @internal
 * @ignore
 * @param {string} value
 * @returns
 */
function convertToUint8Array(value) {
    if (typeof value !== "string") {
        throw new TypeError("value to convert should be string");
    }
    const arr = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i++) {
        arr[i] = value.charCodeAt(i);
    }
    return arr;
}
/**
 * Encodes a byte array in base64 format.
 * @param value the Uint8Aray to encode
 * @internal
 * @ignore
 * @param {Uint8Array} value
 * @returns {string}
 */
function encodeByteArray(value) {
    let str = "";
    for (let i = 0; i < value.length; i++) {
        str += String.fromCharCode(value[i]);
    }
    return btoa(str);
}
function createSharedAccessToken(uri, saName, saKey, nowMs, ttl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uri || !saName || !saKey) {
            throw "Missing required parameter";
        }
        var encoded = encodeURIComponent(uri);
        if (nowMs == null) {
            nowMs = new Date().getTime();
        }
        if (ttl == null) {
            const week = 60 * 60 * 24 * 7;
            ttl = Math.round(nowMs / 1000) + week;
        }
        var signature = encoded + '\n' + ttl;
        const textEncoder = new TextEncoder();
        var signatureUTF8 = textEncoder.encode(signature);
        let hash = yield generateKey(saKey, signatureUTF8);
        return 'SharedAccessSignature sr=' + encoded + '&sig=' +
            encodeURIComponent(hash) + '&se=' + ttl + '&skn=' + saName;
    });
}
//# sourceMappingURL=sasBrowser.js.map