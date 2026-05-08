[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex ec1afeb..2b0b188 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -10,8 +10,12 @@[m
       "dependencies": {[m
         "@supabase/ssr": "^0.10.2",[m
         "@supabase/supabase-js": "^2.105.3",[m
[32m+[m[32m        "@tiptap/pm": "^3.22.5",[m
[32m+[m[32m        "@tiptap/react": "^3.22.5",[m
[32m+[m[32m        "@tiptap/starter-kit": "^3.22.5",[m
         "class-variance-authority": "^0.7.1",[m
         "clsx": "^2.1.1",[m
[32m+[m[32m        "isomorphic-dompurify": "^3.12.0",[m
         "lucide-react": "^1.14.0",[m
         "next": "16.2.4",[m
         "react": "19.2.4",[m
[36m@@ -42,6 +46,53 @@[m
         "url": "https://github.com/sponsors/sindresorhus"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@asamuzakjp/css-color": {[m
[32m+[m[32m      "version": "5.1.11",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@asamuzakjp/css-color/-/css-color-5.1.11.tgz",[m
[32m+[m[32m      "integrity": "sha512-KVw6qIiCTUQhByfTd78h2yD1/00waTmm9uy/R7Ck/ctUyAPj+AEDLkQIdJW0T8+qGgj3j5bpNKK7Q3G+LedJWg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@asamuzakjp/generational-cache": "^1.0.1",[m
[32m+[m[32m        "@csstools/css-calc": "^3.2.0",[m
[32m+[m[32m        "@csstools/css-color-parser": "^4.1.0",[m
[32m+[m[32m        "@csstools/css-parser-algorithms": "^4.0.0",[m
[32m+[m[32m        "@csstools/css-tokenizer": "^4.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@asamuzakjp/dom-selector": {[m
[32m+[m[32m      "version": "7.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@asamuzakjp/dom-selector/-/dom-selector-7.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-67RZDnYRc8H/8MLDgQCDE//zoqVFwajkepHZgmXrbwybzXOEwOWGPYGmALYl9J2DOLfFPPs6kKCqmbzV895hTQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@asamuzakjp/generational-cache": "^1.0.1",[m
[32m+[m[32m        "@asamuzakjp/nwsapi": "^2.3.9",[m
[32m+[m[32m        "bidi-js": "^1.0.3",[m
[32m+[m[32m        "css-tree": "^3.2.1",[m
[32m+[m[32m        "is-potential-custom-element-name": "^1.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@asamuzakjp/generational-cache": {[m
[32m+[m[32m      "version": "1.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@asamuzakjp/generational-cache/-/generational-cache-1.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-wajfB8KqzMCN2KGNFdLkReeHncd0AslUSrvHVvvYWuU8ghncRJoA50kT3zP9MVL0+9g4/67H+cdvBskj9THPzg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@asamuzakjp/nwsapi": {[m
[32m+[m[32m      "version": "2.3.9",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@asamuzakjp/nwsapi/-/nwsapi-2.3.9.tgz",[m
[32m+[m[32m      "integrity": "sha512-n8GuYSrI9bF7FFZ/SjhwevlHc8xaVlb/7HmHelnc/PZXBD2ZR49NnN9sMMuDdEGPeeRQ5d0hqlSlEpgCX3Wl0Q==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/@babel/code-frame": {[m
       "version": "7.29.0",[m
       "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",[m
[36m@@ -282,6 +333,152 @@[m
         "node": ">=6.9.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@bramus/specificity": {[m
[32m+[m[32m      "version": "2.4.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@bramus/specificity/-/specificity-2.4.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-ctxtJ/eA+t+6q2++vj5j7FYX3nRu311q1wfYH3xjlLOsczhlhxAg2FWNUXhpGvAw3BWo1xBcvOV6/YLc2r5FJw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "css-tree": "^3.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "specificity": "bin/cli.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/color-helpers": {[m
[32m+[m[32m      "version": "6.0.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/color-helpers/-/color-helpers-6.0.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-LMGQLS9EuADloEFkcTBR3BwV/CGHV7zyDxVRtVDTwdI2Ca4it0CCVTT9wCkxSgokjE5Ho41hEPgb8OEUwoXr6Q==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT-0",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/css-calc": {[m
[32m+[m[32m      "version": "3.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/css-calc/-/css-calc-3.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-bR9e6o2BDB12jzN/gIbjHa5wLJ4UjD1CB9pM7ehlc0ddk6EBz+yYS1EV2MF55/HUxrHcB/hehAyt5vhsA3hx7w==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@csstools/css-parser-algorithms": "^4.0.0",[m
[32m+[m[32m        "@csstools/css-tokenizer": "^4.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/css-color-parser": {[m
[32m+[m[32m      "version": "4.1.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/css-color-parser/-/css-color-parser-4.1.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-U0KhLYmy2GVj6q4T3WaAe6NPuFYCPQoE3b0dRGxejWDgcPp8TP7S5rVdM5ZrFaqu4N67X8YaPBw14dQSYx3IyQ==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@csstools/color-helpers": "^6.0.2",[m
[32m+[m[32m        "@csstools/css-calc": "^3.2.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@csstools/css-parser-algorithms": "^4.0.0",[m
[32m+[m[32m        "@csstools/css-tokenizer": "^4.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/css-parser-algorithms": {[m
[32m+[m[32m      "version": "4.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/css-parser-algorithms/-/css-parser-algorithms-4.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-+B87qS7fIG3L5h3qwJ/IFbjoVoOe/bpOdh9hAjXbvx0o8ImEmUsGXN0inFOnk2ChCFgqkkGFQ+TpM5rbhkKe4w==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@csstools/css-tokenizer": "^4.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/css-syntax-patches-for-csstree": {[m
[32m+[m[32m      "version": "1.1.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/css-syntax-patches-for-csstree/-/css-syntax-patches-for-csstree-1.1.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-SH60bMfrRCJF3morcdk57WklujF4Jr/EsQUzqkarfHXEFcAR1gg7fS/chAE922Sehgzc1/+Tz5H3Ypa1HiEKrg==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT-0",[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "css-tree": "^3.2.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "css-tree": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@csstools/css-tokenizer": {[m
[32m+[m[32m      "version": "4.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@csstools/css-tokenizer/-/css-tokenizer-4.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-QxULHAm7cNu72w97JUNCBFODFaXpbDg+dP8b/oWFAZ2MTRppA3U00Y2L1HqaS4J6yBqxwa/Y3nMBaxVKbB/NsA==",[m
[32m+[m[32m      "funding": [[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "github",[m
[32m+[m[32m          "url": "https://github.com/sponsors/csstools"[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "type": "opencollective",[m
[32m+[m[32m          "url": "https://opencollective.com/csstools"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/@emnapi/core": {[m
       "version": "1.10.0",[m
       "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",[m
[36m@@ -459,6 +656,51 @@[m
         "node": "^18.18.0 || ^20.9.0 || >=21.1.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@exodus/bytes": {[m
[32m+[m[32m      "version": "1.15.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@exodus/bytes/-/bytes-1.15.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-UY0nlA+feH81UGSHv92sLEPLCeZFjXOuHhrIo0HQydScuQc8s0A7kL/UdgwgDq8g8ilksmuoF35YVTNphV2aBQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@noble/hashes": "^1.8.0 || ^2.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@noble/hashes": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@floating-ui/core": {[m
[32m+[m[32m      "version": "1.7.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@floating-ui/core/-/core-1.7.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-1Ih4WTWyw0+lKyFMcBHGbb5U5FtuHJuujoyyr5zTaWS5EYMeT6Jb2AuDeftsCsEuchO+mM2ij5+q9crhydzLhQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true,[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@floating-ui/utils": "^0.2.11"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@floating-ui/dom": {[m
[32m+[m[32m      "version": "1.7.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@floating-ui/dom/-/dom-1.7.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-9gZSAI5XM36880PPMm//9dfiEngYoC6Am2izES1FF406YFsjvyBMmeJ2g4SAju3xWwtuynNRFL2s9hgxpLI5SQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true,[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@floating-ui/core": "^1.7.5",[m
[32m+[m[32m        "@floating-ui/utils": "^0.2.11"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@floating-ui/utils": {[m
[32m+[m[32m      "version": "0.2.11",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@floating-ui/utils/-/utils-0.2.11.tgz",[m
[32m+[m[32m      "integrity": "sha512-RiB/yIh78pcIxl6lLMG0CgBXAZ2Y0eVHqMPYugu+9U0AeT6YBeiJpf7lbdJNIugFP5SIjwNRgo4DhR1Qxi26Gg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true[m
[32m+[m[32m    },[m
     "node_modules/@humanfs/core": {[m
       "version": "0.19.2",[m
       "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",[m
[36m@@ -1736,35 +1978,463 @@[m
         "node": ">= 20"[m
       }[m
     },[m
[31m-    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {[m
[31m-      "version": "4.2.4",[m
[31m-      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.2.4.tgz",[m
[31m-      "integrity": "sha512-ESlKG0EpVJQwRjXDDa9rLvhEAh0mhP1sF7sap9dNZT0yyl9SAG6T7gdP09EH0vIv0UNTlo6jPWyujD6559fZvw==",[m
[31m-      "cpu": [[m
[31m-        "x64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {[m
[32m+[m[32m      "version": "4.2.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.2.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-ESlKG0EpVJQwRjXDDa9rLvhEAh0mhP1sF7sap9dNZT0yyl9SAG6T7gdP09EH0vIv0UNTlo6jPWyujD6559fZvw==",[m
[32m+[m[32m      "cpu": [[m
[32m+[m[32m        "x64"[m
[32m+[m[32m      ],[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true,[m
[32m+[m[32m      "os": [[m
[32m+[m[32m        "win32"[m
[32m+[m[32m      ],[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">= 20"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tailwindcss/postcss": {[m
[32m+[m[32m      "version": "4.2.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.2.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-wgAVj6nUWAolAu8YFvzT2cTBIElWHkjZwFYovF+xsqKsW2ADxM/X2opxj5NsF/qVccAOjRNe8X2IdPzMsWyHTg==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@alloc/quick-lru": "^5.2.0",[m
[32m+[m[32m        "@tailwindcss/node": "4.2.4",[m
[32m+[m[32m        "@tailwindcss/oxide": "4.2.4",[m
[32m+[m[32m        "postcss": "^8.5.6",[m
[32m+[m[32m        "tailwindcss": "4.2.4"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/core": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/core/-/core-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-L1lhWz6ujGny8LduTJ7MBWYhzigwOvfUJUrJ7IzOJSuy3+OAzisdGDD1GV7LEO/hU0Hr2Mkm1wajRIHExvS9HQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-blockquote": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-blockquote/-/extension-blockquote-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-ajyP5W8fG5Hrru47T/eF3xMKOpNvWofgNJqBTeNuGl02sYxsy9a4EunyFxudsaZP9WW3VOD4SaIWr5+MqpbnOQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-bold": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-bold/-/extension-bold-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-l/uDtpJISiFFyfctvnODNWBN/XPZI1jVZRacTRDDnSn8+x6KQ7G2qgFYueU7KvVJGDFVT39Iio56mcFRG/Pozg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-bubble-menu": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-bubble-menu/-/extension-bubble-menu-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-yrNlFQQJY5MmhBpmD8tnmaSmyUQrEvgyPKa3bzVeWEhDSG1CW4A0ZSMx3hrA9yFO0HWfw3IJmvSCycEZQBalpQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true,[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@floating-ui/dom": "^1.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-bullet-list": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-bullet-list/-/extension-bullet-list-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-cf54fG9AybU8NgPMv1TOcoqAkELeRc/VpnSCt/rIJZphWQx9nsFmrtkrlCatrIcCaGtNZYwlHlMnC5LVVMu0uA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extension-list": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-code": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-code/-/extension-code-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-mwDNOJC9rYbDu/JcqrN4dbUQRklJU8Fuk2raxD/IvFw9qUIcPCmxQ2XT9UTKmZz/Ju7Kdy72fss6XpgWv6gLAQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-code-block": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-code-block/-/extension-code-block-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-d123kCfLdJTi4fue1m0+TNFztDkmIRSZGZmGu6H9KqwG5Q7IzjT9o8lzRsz+pXxYqHvqgYmXoEpM6srbzXx/Ag==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-document": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-document/-/extension-document-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-8NJERd+pCtvSuEP4C4WMGYmRRCV12ePZL7bC+QUdFlbdXg+kNZS0zZ7hh879tYA0Kidbi8rWWD1Tx+H2ezkmMw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-dropcursor": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-dropcursor/-/extension-dropcursor-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-Mp40DaFrY3sEUVtFqmxrR0BmU4G3k8GCYYNGqNa9OqWv7BrcFDC03V2n3okESDKt4MKkzhQQmypq+ouLy8dLfA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extensions": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-floating-menu": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-floating-menu/-/extension-floating-menu-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-dhem4sTPhyQgQ+pFp2Oud4k4FSQz9PVMgeQAC9288SmGwxBkJNveDAw6sKTMrumqDvwkJrtslXIupq9TZYQnzg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true,[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@floating-ui/dom": "^1.0.0",[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-gapcursor": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-gapcursor/-/extension-gapcursor-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-4WkMu7qqjbsm8hCQS+8X+la1wjriN0SKoRdvpfKH33qM50MB34tYJuGLAO+y7TTh4MMMco3AZCKPBL5JVMqNIg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extensions": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-hard-break": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-hard-break/-/extension-hard-break-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-n0R2mUVYZU2AVbJhg/WcY9+zx690wVwvsItHJf0DrYbf1tCYHx+PRHUt/AoXk6u8BSmnkb8/FDziS8m3mjfpSg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-heading": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-heading/-/extension-heading-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-hjyEG4947PAhMBfP1G6B0QAh6+y9mp2C5BQmNjprA05/lQzDAT7KFZzNh8ZVp3ol6aICKq/N1gFOW9Dc/9FUOw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-horizontal-rule": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-horizontal-rule/-/extension-horizontal-rule-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-vUV0/ugIbXOc8SJib0h8UMhgcqZXWu/dkEhlswZN4VVven1o5enkfxEiDw+OyIJHi5rUkrdhsQ/KTxG/Xb7X8A==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-italic": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-italic/-/extension-italic-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-4T8baSiLkeIymTgEwirxDFt5YgYofkP3m1+MGYdGy2HKcOK+1vpvlPhEO1X5qtZngtJW5S4+njKjinRg52A4PA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-link": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-link/-/extension-link-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-d671MvF3GPKoS2OVxjIlQ7hIE7MS3hREdR+d4cvnnoiLLD+ZJ6KgDnxmWqF0a1s4qxLWK2KxKRSOIfYGE31QWQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "linkifyjs": "^4.3.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-list": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-list/-/extension-list-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-cVO3ZHCgxAWZ4zrFSs81FO2nyCk1wb2EHkpLpW98FzbJLkN9rDkazhW99P3HRWy/CvUldOT+8ecI1YrQtBojMg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-list-item": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-list-item/-/extension-list-item-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-W7uTmyKLhlsvuTPLv+8WwnsY+mlikBFIoLSvVcBaFt4MwpsZ+DeB6KQg02Y7tbtaAnG7rXu9Fvw2QORh2P728A==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extension-list": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-list-keymap": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-list-keymap/-/extension-list-keymap-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-cGUnxJ0y515e1bVHNjUmbx7oWHoEon59w6BA5N2KwV9iW2mZZchlTX4yxJSOX+ixeVRChsa7YwC3Z1jUZ6AMEg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extension-list": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-ordered-list": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-ordered-list/-/extension-ordered-list-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-OXdh4k4CNrukwiSdWdEQ49uvgnqvR0Z9aNSP4HI5/kZQ/Te1NtRtYCpUrzWyO/7CtjcCisXHti0o9C/TV8YMbQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/extension-list": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-paragraph": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-paragraph/-/extension-paragraph-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-52KCto4+XKpnBWpIufspWLyq4UWxAWC72ANPdGuIhbi72NRTabiTbTVN40uwGSPkyakeESG0/vKdWJCVvB4f0g==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-strike": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-strike/-/extension-strike-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-42WrrFK5gOom/0znH85x12Mw5IQ/6O6DWdyUWoRIrNA/qJpuHtU8oVU+bIgU2tuomMGHruRjIzgBQv5sBjEtww==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-text": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-text/-/extension-text-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-bzpDOdAEo1JeoVZDIyV0oY0jGXkEG+AzF70SzHoRSjOvFDtKWunyXf9eO1OnOr2/fmMcckT2qwUBNBMQplWBzw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extension-underline": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extension-underline/-/extension-underline-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-9ut09rJD0iEbS6sk7yd2j6IwuFDLTNmDEGTDLodvqAfi+bq7ddsTDv0YviXoZaA9sdHAdTEVr2ITy2m6WK5jpA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/extensions": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/extensions/-/extensions-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-Ifg4MzKCj3uRqe3ieTwYnomu2y4p7EXr2avVSKZYfh12i2dyWe2Gkn1KuZDREANVE+gHqFlQjJRYzhJFwzSCrg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/pm": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/pm/-/pm-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-Cr9Mv4igxvI2tKMiahw48sZxva3PfDzypErH8IB82N+9qa9n9ygVMt0BOaDg53hLKxEEVeYr2S/wCcJIVFgBTw==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "win32"[m
[31m-      ],[m
[31m-      "engines": {[m
[31m-        "node": ">= 20"[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-changeset": "^2.3.0",[m
[32m+[m[32m        "prosemirror-commands": "^1.6.2",[m
[32m+[m[32m        "prosemirror-dropcursor": "^1.8.1",[m
[32m+[m[32m        "prosemirror-gapcursor": "^1.3.2",[m
[32m+[m[32m        "prosemirror-history": "^1.4.1",[m
[32m+[m[32m        "prosemirror-keymap": "^1.2.2",[m
[32m+[m[32m        "prosemirror-model": "^1.24.1",[m
[32m+[m[32m        "prosemirror-schema-list": "^1.5.0",[m
[32m+[m[32m        "prosemirror-state": "^1.4.3",[m
[32m+[m[32m        "prosemirror-tables": "^1.6.4",[m
[32m+[m[32m        "prosemirror-transform": "^1.10.2",[m
[32m+[m[32m        "prosemirror-view": "^1.38.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
       }[m
     },[m
[31m-    "node_modules/@tailwindcss/postcss": {[m
[31m-      "version": "4.2.4",[m
[31m-      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.2.4.tgz",[m
[31m-      "integrity": "sha512-wgAVj6nUWAolAu8YFvzT2cTBIElWHkjZwFYovF+xsqKsW2ADxM/X2opxj5NsF/qVccAOjRNe8X2IdPzMsWyHTg==",[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@tiptap/react": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/react/-/react-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-36WHEs+vPmB//V1ff7Ujcnpz7Ey5g8lhpI/0+hoanSbdiPMTQ7qZVWwMovIkMKDlqWVp2fxBgeYM1861jyFzTw==",[m
       "license": "MIT",[m
       "dependencies": {[m
[31m-        "@alloc/quick-lru": "^5.2.0",[m
[31m-        "@tailwindcss/node": "4.2.4",[m
[31m-        "@tailwindcss/oxide": "4.2.4",[m
[31m-        "postcss": "^8.5.6",[m
[31m-        "tailwindcss": "4.2.4"[m
[32m+[m[32m        "@types/use-sync-external-store": "^0.0.6",[m
[32m+[m[32m        "fast-equals": "^5.3.3",[m
[32m+[m[32m        "use-sync-external-store": "^1.4.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
[32m+[m[32m      },[m
[32m+[m[32m      "optionalDependencies": {[m
[32m+[m[32m        "@tiptap/extension-bubble-menu": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-floating-menu": "^3.22.5"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@tiptap/core": "3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "3.22.5",[m
[32m+[m[32m        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",[m
[32m+[m[32m        "@types/react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0",[m
[32m+[m[32m        "react": "^17.0.0 || ^18.0.0 || ^19.0.0",[m
[32m+[m[32m        "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@tiptap/starter-kit": {[m
[32m+[m[32m      "version": "3.22.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@tiptap/starter-kit/-/starter-kit-3.22.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-LZ/LYbwH6rnDi5DnRyagkuNsYAVyhM+yJvvz+ZuYA0JkPiTXJV86J5PWSKew8M0gVfMHcNVtKjfQCvViFCeIgw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@tiptap/core": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-blockquote": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-bold": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-bullet-list": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-code": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-code-block": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-document": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-dropcursor": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-gapcursor": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-hard-break": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-heading": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-horizontal-rule": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-italic": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-link": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-list": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-list-item": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-list-keymap": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-ordered-list": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-paragraph": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-strike": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-text": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extension-underline": "^3.22.5",[m
[32m+[m[32m        "@tiptap/extensions": "^3.22.5",[m
[32m+[m[32m        "@tiptap/pm": "^3.22.5"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "github",[m
[32m+[m[32m        "url": "https://github.com/sponsors/ueberdosis"[m
       }[m
     },[m
     "node_modules/@tybys/wasm-util": {[m
[36m@@ -1812,7 +2482,6 @@[m
       "version": "19.2.14",[m
       "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.14.tgz",[m
       "integrity": "sha512-ilcTH/UniCkMdtexkoCN0bI7pMcJDvmQFPvuPvmEaYA/NSfFTAgdUSLAoVjaRJm7+6PvcM+q1zYOwS4wTYMF9w==",[m
[31m-      "dev": true,[m
       "license": "MIT",[m
       "dependencies": {[m
         "csstype": "^3.2.2"[m
[36m@@ -1822,12 +2491,24 @@[m
       "version": "19.2.3",[m
       "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.3.tgz",[m
       "integrity": "sha512-jp2L/eY6fn+KgVVQAOqYItbF0VY/YApe5Mz2F0aykSO8gx31bYCZyvSeYxCHKvzHG5eZjc+zyaS5BrBWya2+kQ==",[m
[31m-      "dev": true,[m
       "license": "MIT",[m
       "peerDependencies": {[m
         "@types/react": "^19.2.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/@types/trusted-types": {[m
[32m+[m[32m      "version": "2.0.7",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",[m
[32m+[m[32m      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "optional": true[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@types/use-sync-external-store": {[m
[32m+[m[32m      "version": "0.0.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@types/use-sync-external-store/-/use-sync-external-store-0.0.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-zFDAD+tlpf2r4asuHEj0XH6pY6i0g5NeAHPn+15wk3BV6JA69eERFXC1gyGThDkVa1zCyKr5jox1+2LbV/AMLg==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/@types/ws": {[m
       "version": "8.18.1",[m
       "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",[m
[36m@@ -2730,6 +3411,15 @@[m
         "node": ">=6.0.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/bidi-js": {[m
[32m+[m[32m      "version": "1.0.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/bidi-js/-/bidi-js-1.0.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-RKshQI1R3YQ+n9YJz2QQ147P66ELpa1FQEg20Dk8oW9t2KgLbpDLLp9aGZ7y8WHSshDknG0bknqGw5/tyCs5tw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "require-from-string": "^2.0.2"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/brace-expansion": {[m
       "version": "1.1.14",[m
       "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.14.tgz",[m
[36m@@ -2974,11 +3664,23 @@[m
         "node": ">= 8"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/css-tree": {[m
[32m+[m[32m      "version": "3.2.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/css-tree/-/css-tree-3.2.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-X7sjQzceUhu1u7Y/ylrRZFU2FS6LRiFVp6rKLPg23y3x3c3DOKAwuXGDp+PAGjh6CSnCjYeAul8pcT8bAl+lSA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "mdn-data": "2.27.1",[m
[32m+[m[32m        "source-map-js": "^1.2.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^10 || ^12.20.0 || ^14.13.0 || >=15.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/csstype": {[m
       "version": "3.2.3",[m
       "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",[m
       "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",[m
[31m-      "dev": true,[m
       "license": "MIT"[m
     },[m
     "node_modules/damerau-levenshtein": {[m
[36m@@ -2988,6 +3690,19 @@[m
       "dev": true,[m
       "license": "BSD-2-Clause"[m
     },[m
[32m+[m[32m    "node_modules/data-urls": {[m
[32m+[m[32m      "version": "7.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/data-urls/-/data-urls-7.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-23XHcCF+coGYevirZceTVD7NdJOqVn+49IHyxgszm+JIiHLoB2TkmPtsYkNWT1pvRSGkc35L6NHs0yHkN2SumA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "whatwg-mimetype": "^5.0.0",[m
[32m+[m[32m        "whatwg-url": "^16.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/data-view-buffer": {[m
       "version": "1.0.2",[m
       "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",[m
[36m@@ -3060,6 +3775,12 @@[m
         }[m
       }[m
     },[m
[32m+[m[32m    "node_modules/decimal.js": {[m
[32m+[m[32m      "version": "10.6.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/decimal.js/-/decimal.js-10.6.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/deep-is": {[m
       "version": "0.1.4",[m
       "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",[m
[36m@@ -3126,6 +3847,15 @@[m
         "node": ">=0.10.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/dompurify": {[m
[32m+[m[32m      "version": "3.4.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.4.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-lHeS9SA/IKeIFFyYciHBr2n0v1VMPlSj843HdLOwjb2OxNwdq9Xykxqhk+FE42MzAdHvInbAolSE4mhahPpjXA==",[m
[32m+[m[32m      "license": "(MPL-2.0 OR Apache-2.0)",[m
[32m+[m[32m      "optionalDependencies": {[m
[32m+[m[32m        "@types/trusted-types": "^2.0.7"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/dunder-proto": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",[m
[36m@@ -3169,6 +3899,18 @@[m
         "node": ">=10.13.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/entities": {[m
[32m+[m[32m      "version": "8.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/entities/-/entities-8.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-zwfzJecQ/Uej6tusMqwAqU/6KL2XaB2VZ2Jg54Je6ahNBGNH6Ek6g3jjNCF0fG9EWQKGZNddNjU5F1ZQn/sBnA==",[m
[32m+[m[32m      "license": "BSD-2-Clause",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.19.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/fb55/entities?sponsor=1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/es-abstract": {[m
       "version": "1.24.2",[m
       "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",[m
[36m@@ -3782,6 +4524,15 @@[m
       "dev": true,[m
       "license": "MIT"[m
     },[m
[32m+[m[32m    "node_modules/fast-equals": {[m
[32m+[m[32m      "version": "5.4.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/fast-equals/-/fast-equals-5.4.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-jt2DW/aNFNwke7AUd+Z+e6pz39KO5rzdbbFCg2sGafS4mk13MI7Z8O5z9cADNn5lhGODIgLwug6TZO2ctf7kcw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/fast-glob": {[m
       "version": "3.3.1",[m
       "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",[m
[36m@@ -4221,6 +4972,18 @@[m
         "hermes-estree": "0.25.1"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/html-encoding-sniffer": {[m
[32m+[m[32m      "version": "6.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/html-encoding-sniffer/-/html-encoding-sniffer-6.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-CV9TW3Y3f8/wT0BRFc1/KAVQ3TUHiXmaAb6VW9vtiMFf7SLoMd1PdAc4W3KFOFETBJUb90KatHqlsZMWV+R9Gg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@exodus/bytes": "^1.6.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/iceberg-js": {[m
       "version": "0.8.1",[m
       "resolved": "https://registry.npmjs.org/iceberg-js/-/iceberg-js-0.8.1.tgz",[m
[36m@@ -4552,6 +5315,12 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/is-potential-custom-element-name": {[m
[32m+[m[32m      "version": "1.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/is-potential-custom-element-name/-/is-potential-custom-element-name-1.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-bCYeRA2rVibKZd+s2625gGnGF/t7DSqDs4dP7CrLA1m7jKWz6pps0LpYLJN8Q64HtmPKJ1hrN3nzPNKFEKOUiQ==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/is-regex": {[m
       "version": "1.2.1",[m
       "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",[m
[36m@@ -4711,6 +5480,19 @@[m
       "dev": true,[m
       "license": "ISC"[m
     },[m
[32m+[m[32m    "node_modules/isomorphic-dompurify": {[m
[32m+[m[32m      "version": "3.12.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/isomorphic-dompurify/-/isomorphic-dompurify-3.12.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-8n+j+6ypTHvriJwFOQ2qusQ6bzGjZVcR3jbe1pBpLcGI1dn4WIl0ctLBngqE5QttquQBAlKXwJeTMw+X7x7qKw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "dompurify": "^3.4.2",[m
[32m+[m[32m        "jsdom": "^29.1.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.13.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/iterator.prototype": {[m
       "version": "1.1.5",[m
       "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",[m
[36m@@ -4759,6 +5541,55 @@[m
         "js-yaml": "bin/js-yaml.js"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/jsdom": {[m
[32m+[m[32m      "version": "29.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/jsdom/-/jsdom-29.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-ECi4Fi2f7BdJtUKTflYRTiaMxIB0O6zfR1fX0GXpUrf6flp8QIYn1UT20YQqdSOfk2dfkCwS8LAFoJDEppNK5Q==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@asamuzakjp/css-color": "^5.1.11",[m
[32m+[m[32m        "@asamuzakjp/dom-selector": "^7.1.1",[m
[32m+[m[32m        "@bramus/specificity": "^2.4.2",[m
[32m+[m[32m        "@csstools/css-syntax-patches-for-csstree": "^1.1.3",[m
[32m+[m[32m        "@exodus/bytes": "^1.15.0",[m
[32m+[m[32m        "css-tree": "^3.2.1",[m
[32m+[m[32m        "data-urls": "^7.0.0",[m
[32m+[m[32m        "decimal.js": "^10.6.0",[m
[32m+[m[32m        "html-encoding-sniffer": "^6.0.0",[m
[32m+[m[32m        "is-potential-custom-element-name": "^1.0.1",[m
[32m+[m[32m        "lru-cache": "^11.3.5",[m
[32m+[m[32m        "parse5": "^8.0.1",[m
[32m+[m[32m        "saxes": "^6.0.0",[m
[32m+[m[32m        "symbol-tree": "^3.2.4",[m
[32m+[m[32m        "tough-cookie": "^6.0.1",[m
[32m+[m[32m        "undici": "^7.25.0",[m
[32m+[m[32m        "w3c-xmlserializer": "^5.0.0",[m
[32m+[m[32m        "webidl-conversions": "^8.0.1",[m
[32m+[m[32m        "whatwg-mimetype": "^5.0.0",[m
[32m+[m[32m        "whatwg-url": "^16.0.1",[m
[32m+[m[32m        "xml-name-validator": "^5.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.13.0 || >=24.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "canvas": "^3.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "canvas": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/jsdom/node_modules/lru-cache": {[m
[32m+[m[32m      "version": "11.3.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.3.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-Gf/KoL3C/MlI7Bt0PGI9I+TeTC/I6r/csU58N4BSNc4lppLBeKsOdFYkK+dX0ABDUMJNfCHTyPpzwwO21Awd3A==",[m
[32m+[m[32m      "license": "BlueOak-1.0.0",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "20 || >=22"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/jsesc": {[m
       "version": "3.1.0",[m
       "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",[m
[36m@@ -5139,6 +5970,12 @@[m
         "url": "https://opencollective.com/parcel"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/linkifyjs": {[m
[32m+[m[32m      "version": "4.3.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/linkifyjs/-/linkifyjs-4.3.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-NT1CJtq3hHIreOianA8aSXn6Cw0JzYOuDQbOrSPe7gqFnCpKP++MQe3ODgO3oh2GJFORkAAdqredOa60z63GbA==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/locate-path": {[m
       "version": "6.0.0",[m
       "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",[m
[36m@@ -5214,6 +6051,12 @@[m
         "node": ">= 0.4"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/mdn-data": {[m
[32m+[m[32m      "version": "2.27.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/mdn-data/-/mdn-data-2.27.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-9Yubnt3e8A0OKwxYSXyhLymGW4sCufcLG6VdiDdUGVkPhpqLxlvP5vl1983gQjJl3tqbrM731mjaZaP68AgosQ==",[m
[32m+[m[32m      "license": "CC0-1.0"[m
[32m+[m[32m    },[m
     "node_modules/merge2": {[m
       "version": "1.4.1",[m
       "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",[m
[36m@@ -5557,6 +6400,12 @@[m
         "node": ">= 0.8.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/orderedmap": {[m
[32m+[m[32m      "version": "2.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/orderedmap/-/orderedmap-2.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-TvAWxi0nDe1j/rtMcWcIj94+Ffe6n7zhow33h40SKxmsmozs6dz/e+EajymfoFcHd7sxNn8yHM8839uixMOV6g==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/own-keys": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.1.tgz",[m
[36m@@ -5620,6 +6469,18 @@[m
         "node": ">=6"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/parse5": {[m
[32m+[m[32m      "version": "8.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/parse5/-/parse5-8.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-z1e/HMG90obSGeidlli3hj7cbocou0/wa5HacvI3ASx34PecNjNQeaHNo5WIZpWofN9kgkqV1q5YvXe3F0FoPw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "entities": "^8.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/inikulin/parse5?sponsor=1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/path-exists": {[m
       "version": "4.0.0",[m
       "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",[m
[36m@@ -5727,11 +6588,139 @@[m
         "react-is": "^16.13.1"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/prosemirror-changeset": {[m
[32m+[m[32m      "version": "2.4.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-changeset/-/prosemirror-changeset-2.4.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-96WBLhOaYhJ+kPhLg3uW359Tz6I/MfcrQfL4EGv4SrcqKEMC1gmoGrXHecPE8eOwTVCJ4IwgfzM8fFad25wNfw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-transform": "^1.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-commands": {[m
[32m+[m[32m      "version": "1.7.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-commands/-/prosemirror-commands-1.7.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-rT7qZnQtx5c0/y/KlYaGvtG411S97UaL6gdp6RIZ23DLHanMYLyfGBV5DtSnZdthQql7W+lEVbpSfwtO8T+L2w==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-model": "^1.0.0",[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "prosemirror-transform": "^1.10.2"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-dropcursor": {[m
[32m+[m[32m      "version": "1.8.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-dropcursor/-/prosemirror-dropcursor-1.8.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-CCk6Gyx9+Tt2sbYk5NK0nB1ukHi2ryaRgadV/LvyNuO3ena1payM2z6Cg0vO1ebK8cxbzo41ku2DE5Axj1Zuiw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "prosemirror-transform": "^1.1.0",[m
[32m+[m[32m        "prosemirror-view": "^1.1.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-gapcursor": {[m
[32m+[m[32m      "version": "1.4.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-gapcursor/-/prosemirror-gapcursor-1.4.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-pMdYaEnjNMSwl11yjEGtgTmLkR08m/Vl+Jj443167p9eB3HVQKhYCc4gmHVDsLPODfZfjr/MmirsdyZziXbQKw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-keymap": "^1.0.0",[m
[32m+[m[32m        "prosemirror-model": "^1.0.0",[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "prosemirror-view": "^1.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-history": {[m
[32m+[m[32m      "version": "1.5.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-history/-/prosemirror-history-1.5.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-zlzTiH01eKA55UAf1MEjtssJeHnGxO0j4K4Dpx+gnmX9n+SHNlDqI2oO1Kv1iPN5B1dm5fsljCfqKF9nFL6HRg==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-state": "^1.2.2",[m
[32m+[m[32m        "prosemirror-transform": "^1.0.0",[m
[32m+[m[32m        "prosemirror-view": "^1.31.0",[m
[32m+[m[32m        "rope-sequence": "^1.3.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-keymap": {[m
[32m+[m[32m      "version": "1.2.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-keymap/-/prosemirror-keymap-1.2.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-4HucRlpiLd1IPQQXNqeo81BGtkY8Ai5smHhKW9jjPKRc2wQIxksg7Hl1tTI2IfT2B/LgX6bfYvXxEpJl7aKYKw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "w3c-keyname": "^2.2.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-model": {[m
[32m+[m[32m      "version": "1.25.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-model/-/prosemirror-model-1.25.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-PIM7E43PBxKce8OQeezAs9j4TP+5yDpZVbuurd1h5phUxEKIu+G2a+EUZzIC5nS1mJktDJWzbqS23n1tsAf5QA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "orderedmap": "^2.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-schema-list": {[m
[32m+[m[32m      "version": "1.5.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-schema-list/-/prosemirror-schema-list-1.5.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-927lFx/uwyQaGwJxLWCZRkjXG0p48KpMj6ueoYiu4JX05GGuGcgzAy62dfiV8eFZftgyBUvLx76RsMe20fJl+Q==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-model": "^1.0.0",[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "prosemirror-transform": "^1.7.3"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-state": {[m
[32m+[m[32m      "version": "1.4.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-state/-/prosemirror-state-1.4.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-6jiYHH2CIGbCfnxdHbXZ12gySFY/fz/ulZE333G6bPqIZ4F+TXo9ifiR86nAHpWnfoNjOb3o5ESi7J8Uz1jXHw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-model": "^1.0.0",[m
[32m+[m[32m        "prosemirror-transform": "^1.0.0",[m
[32m+[m[32m        "prosemirror-view": "^1.27.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-tables": {[m
[32m+[m[32m      "version": "1.8.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-tables/-/prosemirror-tables-1.8.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-V/0cDCsHKHe/tfWkeCmthNUcEp1IVO3p6vwN8XtwE9PZQLAZJigbw3QoraAdfJPir4NKJtNvOB8oYGKRl+t0Dw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-keymap": "^1.2.3",[m
[32m+[m[32m        "prosemirror-model": "^1.25.4",[m
[32m+[m[32m        "prosemirror-state": "^1.4.4",[m
[32m+[m[32m        "prosemirror-transform": "^1.10.5",[m
[32m+[m[32m        "prosemirror-view": "^1.41.4"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-transform": {[m
[32m+[m[32m      "version": "1.12.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-transform/-/prosemirror-transform-1.12.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-GxboyN4AMIsoHNtz5uf2r2Ru551i5hWeCMD6E2Ib4Eogqoub0NflniaBPVQ4MrGE5yZ8JV9tUHg9qcZTTrcN4w==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-model": "^1.21.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/prosemirror-view": {[m
[32m+[m[32m      "version": "1.41.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/prosemirror-view/-/prosemirror-view-1.41.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-TnKDdohEatgyZNGCDWIdccOHXhYloJwbwU+phw/a23KBvJIR9lWQWW7WHHK3vBdOLDNuF7TaX98GObUZOWkOnA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "prosemirror-model": "^1.20.0",[m
[32m+[m[32m        "prosemirror-state": "^1.0.0",[m
[32m+[m[32m        "prosemirror-transform": "^1.1.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/punycode": {[m
       "version": "2.3.1",[m
       "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",[m
       "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",[m
[31m-      "dev": true,[m
       "license": "MIT",[m
       "engines": {[m
         "node": ">=6"[m
[36m@@ -5830,6 +6819,15 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/require-from-string": {[m
[32m+[m[32m      "version": "2.0.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=0.10.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/resolve": {[m
       "version": "2.0.0-next.6",[m
       "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.6.tgz",[m
[36m@@ -5885,6 +6883,12 @@[m
         "node": ">=0.10.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/rope-sequence": {[m
[32m+[m[32m      "version": "1.3.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/rope-sequence/-/rope-sequence-1.3.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-UT5EDe2cu2E/6O4igUr5PSFs23nvvukicWHx6GnOPlHAiiYbzNuCRQCuiUdHJQcqKalLKlrYJnjY0ySGsXNQXQ==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/run-parallel": {[m
       "version": "1.2.0",[m
       "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",[m
[36m@@ -5964,6 +6968,18 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/saxes": {[m
[32m+[m[32m      "version": "6.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/saxes/-/saxes-6.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-xAg7SOnEhrm5zI3puOOKyy1OMcMlIJZYNJY7xLBwSze0UjhPLnWfj2GF2EpT0jmzaJKIWKHLsaSSajf35bcYnA==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "xmlchars": "^2.2.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=v12.22.7"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/scheduler": {[m
       "version": "0.27.0",[m
       "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",[m
[36m@@ -6401,6 +7417,12 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/symbol-tree": {[m
[32m+[m[32m      "version": "3.2.4",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/symbol-tree/-/symbol-tree-3.2.4.tgz",[m
[32m+[m[32m      "integrity": "sha512-9QNk5KwDF+Bvz+PyObkmSYjI5ksVUYtjW7AU22r2NKcfLJcXp96hkDWU3+XndOsUb+AQ9QhfzfCT2O+CNWT5Tw==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/tailwind-merge": {[m
       "version": "3.5.0",[m
       "resolved": "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-3.5.0.tgz",[m
[36m@@ -6480,6 +7502,24 @@[m
         "url": "https://github.com/sponsors/jonschlinkert"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/tldts": {[m
[32m+[m[32m      "version": "7.0.30",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/tldts/-/tldts-7.0.30.tgz",[m
[32m+[m[32m      "integrity": "sha512-ELrFxuqsDdHUwoh0XxDbxuLD3Wnz49Z57IFvTtvWy1hJdcMZjXLIuonjilCiWHlT2GbE4Wlv1wKVTzDFnXH1aw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "tldts-core": "^7.0.30"[m
[32m+[m[32m      },[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "tldts": "bin/cli.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/tldts-core": {[m
[32m+[m[32m      "version": "7.0.30",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/tldts-core/-/tldts-core-7.0.30.tgz",[m
[32m+[m[32m      "integrity": "sha512-uiHN8PIB1VmWyS98eZYja4xzlYqeFZVjb4OuYlJQnZAuJhMw4PbKQOKgHKhBdJR3FE/t5mUQ1Kd80++B+qhD1Q==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/to-regex-range": {[m
       "version": "5.0.1",[m
       "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",[m
[36m@@ -6493,6 +7533,30 @@[m
         "node": ">=8.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/tough-cookie": {[m
[32m+[m[32m      "version": "6.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-6.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-LktZQb3IeoUWB9lqR5EWTHgW/VTITCXg4D21M+lvybRVdylLrRMnqaIONLVb5mav8vM19m44HIcGq4qASeu2Qw==",[m
[32m+[m[32m      "license": "BSD-3-Clause",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "tldts": "^7.0.5"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=16"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/tr46": {[m
[32m+[m[32m      "version": "6.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/tr46/-/tr46-6.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-bLVMLPtstlZ4iMQHpFHTR7GAGj2jxi8Dg0s2h2MafAE4uSWF98FC/3MomU51iQAMf8/qDUbKWf5GxuvvVcXEhw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "punycode": "^2.3.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/ts-api-utils": {[m
       "version": "2.5.0",[m
       "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",[m
[36m@@ -6686,6 +7750,15 @@[m
         "url": "https://github.com/sponsors/ljharb"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/undici": {[m
[32m+[m[32m      "version": "7.25.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/undici/-/undici-7.25.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-xXnp4kTyor2Zq+J1FfPI6Eq3ew5h6Vl0F/8d9XU5zZQf1tX9s2Su1/3PiMmUANFULpmksxkClamIZcaUqryHsQ==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20.18.1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/undici-types": {[m
       "version": "6.21.0",[m
       "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",[m
[36m@@ -6768,6 +7841,65 @@[m
         "punycode": "^2.1.0"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/use-sync-external-store": {[m
[32m+[m[32m      "version": "1.6.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/w3c-keyname": {[m
[32m+[m[32m      "version": "2.2.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/w3c-keyname/-/w3c-keyname-2.2.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-dpojBhNsCNN7T82Tm7k26A6G9ML3NkhDsnw9n/eoxSRlVBB4CEtIQ/KTCLI2Fwf3ataSXRhYFkQi3SlnFwPvPQ==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/w3c-xmlserializer": {[m
[32m+[m[32m      "version": "5.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/w3c-xmlserializer/-/w3c-xmlserializer-5.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-o8qghlI8NZHU1lLPrpi2+Uq7abh4GGPpYANlalzWxyWteJOCsr/P+oPBA49TOLu5FTZO4d3F9MnWJfiMo4BkmA==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "xml-name-validator": "^5.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=18"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/webidl-conversions": {[m
[32m+[m[32m      "version": "8.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-8.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BMhLD/Sw+GbJC21C/UgyaZX41nPt8bUTg+jWyDeg7e7YN4xOM05YPSIXceACnXVtqyEw/LMClUQMtMZ+PGGpqQ==",[m
[32m+[m[32m      "license": "BSD-2-Clause",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/whatwg-mimetype": {[m
[32m+[m[32m      "version": "5.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/whatwg-mimetype/-/whatwg-mimetype-5.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-sXcNcHOC51uPGF0P/D4NVtrkjSU2fNsm9iog4ZvZJsL3rjoDAzXZhkm2MWt1y+PUdggKAYVoMAIYcs78wJ51Cw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=20"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/whatwg-url": {[m
[32m+[m[32m      "version": "16.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-16.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-1to4zXBxmXHV3IiSSEInrreIlu02vUOvrhxJJH5vcxYTBDAx51cqZiKdyTxlecdKNSjj8EcxGBxNf6Vg+945gw==",[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@exodus/bytes": "^1.11.0",[m
[32m+[m[32m        "tr46": "^6.0.0",[m
[32m+[m[32m        "webidl-conversions": "^8.0.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/which": {[m
       "version": "2.0.2",[m
       "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",[m
[36m@@ -6904,6 +8036,21 @@[m
         }[m
       }[m
     },[m
[32m+[m[32m    "node_modules/xml-name-validator": {[m
[32m+[m[32m      "version": "5.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/xml-name-validator/-/xml-name-validator-5.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-EvGK8EJ3DhaHfbRlETOWAS5pO9MZITeauHKJyb8wyajUfQUenkIg2MvLDTZ4T/TgIcm3HU0TFBgWWboAZ30UHg==",[m
[32m+[m[32m      "license": "Apache-2.0",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=18"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/xmlchars": {[m
[32m+[m[32m      "version": "2.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
     "node_modules/yallist": {[m
       "version": "3.1.1",[m
       "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",[m
[1mdiff --git a/package.json b/package.json[m
[1mindex f30f6c4..0b666ec 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -12,8 +12,12 @@[m
   "dependencies": {[m
     "@supabase/ssr": "^0.10.2",[m
     "@supabase/supabase-js": "^2.105.3",[m
[32m+[m[32m    "@tiptap/pm": "^3.22.5",[m
[32m+[m[32m    "@tiptap/react": "^3.22.5",[m
[32m+[m[32m    "@tiptap/starter-kit": "^3.22.5",[m
     "class-variance-authority": "^0.7.1",[m
     "clsx": "^2.1.1",[m
[32m+[m[32m    "isomorphic-dompurify": "^3.12.0",[m
     "lucide-react": "^1.14.0",[m
     "next": "16.2.4",[m
     "react": "19.2.4",[m
