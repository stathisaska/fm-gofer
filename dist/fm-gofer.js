const w = "The FM script call timed out", l = "fmGoferCallbackD7738642C91848E08720EAC24EDDA483";
function x() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    var r = Math.random() * 16 | 0, e = t == "x" ? r : r & 3 | 8;
    return e.toString(16);
  });
}
function I() {
  return typeof window.fmGofer == "object" && window.fmGofer !== null && !Array.isArray(window.fmGofer);
}
function y() {
  I() || (window.fmGofer = {
    promises: {},
    callbackName: l
  }, window[l] = G);
}
function v(o, t, r, e) {
  const n = x(), i = { resolve: o, reject: t };
  return r !== 0 && (i.timeoutID = setTimeout(() => {
    i.fmOnReadyIntervalID && clearInterval(i.fmOnReadyIntervalID), u(n), t(e);
  }, r)), window.fmGofer.promises[n] = i, n;
}
function D(o) {
  return window.fmGofer.promises[o];
}
function u(o) {
  var r, e;
  const t = (e = (r = window.fmGofer) == null ? void 0 : r.promises) == null ? void 0 : e[o];
  return t && (t.timeoutID && clearTimeout(t.timeoutID), t.fmOnReadyIntervalID && clearInterval(t.fmOnReadyIntervalID)), delete window.fmGofer.promises[o];
}
function G(o, t, r) {
  try {
    r === "0" && (r = "");
    const e = D(o);
    if (typeof e > "u")
      throw new Error(`No promise found for promiseID ${o}.`);
    e.timeoutID && clearTimeout(e.timeoutID), r ? e.reject(t) : e.resolve(t), u(o);
  } catch (e) {
    console.error(e);
  }
}
function h(o, t, r) {
  let e;
  return {
    promise: new Promise((i, s) => {
      if (typeof window.FileMaker == "object") {
        window.FileMaker.PerformScriptWithOption(o, t, r);
        return;
      }
      const f = 5, a = 2e3;
      let m = 0;
      e = setInterval(() => {
        m += f, m > a && (clearInterval(e), s(`window.FileMaker not found within ${a} ms`)), typeof window.FileMaker == "object" && (clearInterval(e), window.FileMaker.PerformScriptWithOption(o, t, r), i());
      }, f);
    }),
    intervalID: e
  };
}
class O extends Promise {
  json() {
    return this.then((t) => JSON.parse(t));
  }
}
const M = O;
function d(o, t, r, e = 0, n = w) {
  if (typeof o != "string" || !o)
    throw new Error("script must be a string");
  if (typeof e != "number")
    throw new Error("timeout must be a number");
  if (typeof n != "string")
    throw new Error("timeoutMessage must be a string");
  return new M(async (i, s) => {
    y();
    const f = v(i, s, e, n), a = {
      promiseID: f,
      callbackName: l,
      parameter: t
    }, m = JSON.stringify(a);
    try {
      const { promise: c, intervalID: p } = h(
        o,
        m,
        r
      );
      window.fmGofer.promises[f].fmOnReadyIntervalID = p, await c;
    } catch (c) {
      u(f), s(c);
    }
  });
}
function P(o, t = void 0, r = 0, e = w) {
  return d(
    o,
    t,
    void 0,
    r,
    e
  );
}
const b = {
  Default: 0,
  Continue: 0,
  Halt: 1,
  Exit: 2,
  Resume: 3,
  Pause: 4,
  SuspendAndResume: 5
}, g = { PerformScript: P, PerformScriptWithOption: d };
export {
  M as FMGPromise,
  b as Option,
  P as PerformScript,
  d as PerformScriptWithOption,
  g as default
};
