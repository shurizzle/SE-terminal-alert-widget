import GraphemeSplitter from "grapheme-splitter";
import { Currency, EventReceived, WidgetLoadData } from "./stream-elements";

const queueAdd = (() => {
  "use strict";

  let CURRENT: Promise<void> | null = null;
  const PENDING: Array<() => Promise<void>> = [];

  const executeNext = () => {
    if (PENDING.length > 0) {
      const next = PENDING.shift();
      let done = false;
      try {
        CURRENT = next();
        done = true;
        CURRENT.finally(executeNext);
      } finally {
        if (!done) {
          requestAnimationFrame(executeNext);
        }
      }
    } else {
      CURRENT = null;
    }
  };

  document.addEventListener("DOMContentLoaded", executeNext);

  const append = (next: () => Promise<void>) => {
    PENDING.push(next);
    if (document.readyState !== "loading" && !CURRENT) {
      executeNext();
    }
  };

  return append;
})();

class Raw {
  public toString: () => string;

  constructor(txt: string) {
    this.toString = txt.toString.bind(txt);
  }
}

const raw = (text: Raw | string): Raw => {
  "use strict";

  if (Object.prototype.isPrototypeOf.call(text, Raw)) {
    return text;
  }

  return new Raw(text as string);
};

const escapeHtml = (unsafe: string): string => {
  "use strict";

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const parseHtml = (str: string): Node[] => {
  "use strict";

  const tmp = document.implementation.createHTMLDocument("");
  tmp.body.innerHTML = str;
  const res: Node[] = [];
  tmp.body.childNodes.forEach((n) => res.push(n));
  return res;
};

const html = (() => {
  "use strict";

  return function html(strings: TemplateStringsArray, ...vars: any[]): Node[] {
    let res = "";
    strings.forEach((str, i) => {
      const s = i === 0 || i === strings.length - 1 ? str.trim() : str;

      res += s;
      if (vars.length > i) {
        const v = vars[i];
        if (Object.prototype.isPrototypeOf.call(v, Raw)) {
          res += v.toString();
        } else if (v !== null && v !== undefined) {
          res += escapeHtml(v.toString());
        }
      }
    });
    return parseHtml(res);
  };
})();

const now: () => number = // @ts-ignore
  (window.performance.now || window.performance.webkitNow).bind(
    window.performance
  );

const escapeCommand = (cmd: Array<string | Raw> | string | Raw): string => {
  "use strict";

  return (Array.isArray(cmd) ? cmd : [cmd])
    .map((item: string | Raw) => {
      if (Object.prototype.isPrototypeOf.call(item, Raw)) {
        return item.toString();
      }

      let it: string = item as string;
      if (/[^A-Za-z0-9_/:=-]/.test(it)) {
        it = `'${it.replace(/'/g, "'\\''")}'`;
        it = it.replace(/^(?:'')+/g, "").replace(/\\'''/g, "\\'");
      }

      return it;
    })
    .join(" ");
};

interface TerminalOptions {
  idleDuration?: number;
  typeDuration?: number;
  loadDuration?: number;
  showDuration?: number;
  title?: string;
  motd?: string | Raw;
  runForever?: boolean;
}

interface ResolvedTerminalOptions {
  idleDuration: number;
  typeDuration: number;
  loadDuration: number;
  showDuration: number;
  title: string;
  motd?: string | Raw;
  runForever: boolean;
}

const resolveTerminalOptions = (
  options?: TerminalOptions
): ResolvedTerminalOptions => {
  "use strict";

  const opts = options ?? {};
  const idleDuration = opts.idleDuration ?? 0.5 * 1000;
  const typeDuration = opts.typeDuration ?? 2 * 1000;
  const loadDuration = opts.loadDuration ?? 1 * 1000;
  const showDuration =
    opts.showDuration ?? 10 * 1000 - idleDuration - typeDuration - loadDuration;
  const title = opts.title ?? "";

  return {
    idleDuration,
    typeDuration,
    loadDuration,
    showDuration,
    title,
    motd: opts.motd,
    runForever: opts.runForever ?? false,
  };
};

const terminal = (
  prompt: string,
  command: Array<string | Raw> | string | Raw,
  options?: TerminalOptions
): Promise<void> => {
  "use strict";

  const opts = resolveTerminalOptions(options);

  const cmd = escapeCommand(command);

  const desktop = document.getElementById("desktop");
  desktop.innerHTML = "";
  desktop.style.display = "block";
  desktop.appendChild(
    html`
      <div class="window">
        <div class="decoration dark">
          <div class="controls">
            <div class="dot red"></div>
            <div class="dot amber"></div>
            <div class="dot green"></div>
          </div>
          <div class="title"><div>${opts.title}</div></div>
          <div class="controls hidden">
            <div class="dot red"></div>
            <div class="dot amber"></div>
            <div class="dot green"></div>
          </div>
        </div>

        <div class="terminal">
          ${opts.motd}
          <div></div>
          <span class="prompt">${prompt}</span>
          <span id="typewriter"></span>
          <span id="cursor">&nbsp;</span>
          <div></div>
        </div>
      </div>
    `[0]
  );
  const typewriter = document.getElementById("typewriter");
  const cursor = document.getElementById("cursor");
  let startTime: number;
  const graphemes = new GraphemeSplitter().splitGraphemes(cmd.trim());

  return new Promise((resolve, reject) => {
    const hide = () => {
      desktop.innerHTML = "";
      desktop.style.display = "none";
      resolve(null);
    };

    const step = () => {
      try {
        const elapsedTime = now() - startTime;
        const state = elapsedTime / opts.typeDuration;

        let max = graphemes.length * state;
        if (max > graphemes.length) {
          max = graphemes.length;
        }

        typewriter.innerText = graphemes.slice(0, max).join("");

        if (elapsedTime < opts.typeDuration) {
          requestAnimationFrame(step);
        } else {
          cursor.parentNode.insertBefore(html`<div></div>`[0], cursor);

          if (opts.runForever) {
            setTimeout(hide, opts.loadDuration + opts.showDuration);
          } else {
            setTimeout(() => {
              cursor.parentNode.insertBefore(
                html`<span class="prompt">${prompt}</span>`[0],
                cursor
              );
              setTimeout(hide, opts.showDuration);
            }, opts.loadDuration);
          }
        }
      } catch (e) {
        reject(e);
      }
    };

    setTimeout(() => {
      startTime = now();
      requestAnimationFrame(step);
    }, opts.idleDuration);
  });
};

const fireTerminal = (
  prompt: string,
  command: Array<string | Raw> | string | Raw,
  options?: TerminalOptions
) => {
  "use strict";

  queueAdd(terminal.bind(this, prompt, command, options));
};

let whoami = "me";
let minHost = 1;
let minRaid = 1;
let userCurrency: Currency = {
  code: "EUR",
  name: "Euro",
  symbol: "€",
};
let minTip = 1;
// let minCheer = 1;

const fireFollow = (who: string) => {
  "use strict";

  return fireTerminal(
    `${who}@ttv:~$ `,
    [raw("tail"), raw("-f"), `/dev/${whoami}`],
    {
      title: `Follow`,
      runForever: true,
    }
  );
};

const fireHost = (who: string, viewers: number) => {
  "use strict";

  return fireTerminal(
    `${who}@ttv:~$ `,
    [raw("ln"), raw("-s"), raw("/proc/self"), `/dev/${whoami}`],
    {
      title: viewers ? `${viewers} viewers` : null,
    }
  );
};

const fireRaid = (who: string, viewers: number) => {
  "use strict";

  return fireTerminal(`${who}@ttv:~$ `, [raw("chroot"), `/mnt/${whoami}`], {
    title: viewers ? `${viewers} viewers` : null,
  });
};

const fireTip = (who: string, amount: number, message?: string) => {
  "use strict";

  return fireTerminal(
    `${who}@ttv:~$ `,
    [
      raw("cat"),
      `+${amount}${userCurrency.symbol}`,
      raw(">"),
      `/dev/${whoami}/funds`,
    ],
    { motd: message }
  );
};

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === "development") {
  for (const name of [
    "fireTerminal",
    "fireFollow",
    "fireHost",
    "fireRaid",
    "fireTip",
  ]) {
    // @ts-ignore
    window[name] = self[name];
    // eval(`window.${name} = ${name}`);
  }
}

window.addEventListener(
  "onEventReceived",
  (obj: CustomEvent<EventReceived>): void => {
    "use strict";

    if (!obj.detail.event) {
      return;
    }

    if (typeof obj.detail.event.itemId !== "undefined") {
      // @ts-ignore
      obj.detail.listener = "redemption-latest";
    }

    switch (obj.detail.listener) {
      case "follower-latest":
        fireFollow(obj.detail.event.name);
        break;
      case "host-latest":
        if (minHost <= obj.detail.event.amount) {
          fireHost(obj.detail.event.name, obj.detail.event.amount);
        }

        break;
      case "raid-latest":
        if (minRaid <= obj.detail.event.amount) {
          fireRaid(obj.detail.event.name, obj.detail.event.amount);
        }

        break;
      case "tip-latest":
        if (minTip <= obj.detail.event.amount) {
          fireTip(
            obj.detail.event.name,
            obj.detail.event.amount,
            obj.detail.event.message
          );
        }

        break;
      default:
        break;
    }
  }
);

interface FieldData {
  minHost: number;
  minRaid: number;
  minTip: number;
  minCheer: number;
  locale: string;
}

window.addEventListener(
  "onWidgetLoad",
  (obj: CustomEvent<WidgetLoadData<FieldData>>): void => {
    "use strict";

    whoami = obj.detail.channel.username;
    userCurrency = obj.detail.currency;
    const { fieldData } = obj.detail;
    // eslint-disable-next-line prefer-destructuring
    minHost = fieldData.minHost;
    // eslint-disable-next-line prefer-destructuring
    minRaid = fieldData.minRaid;
    // eslint-disable-next-line prefer-destructuring
    minTip = fieldData.minTip;
  }
);
