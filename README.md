# Wakatime Adobe Plugin

<img alt="Plugin preview" align="right" width="302" height="452" src=".github/preview.png">

The Wakatime plugin is a powerful integration that brings [Wakatime](https://wakatime.com/)'s time-tracking functionality to Adobe products.

**Currently supported features:**

- [x] Tracking time (every 2 min)
- [x] Tracking file path
- [x] Tracking file name
- [x] Tracking machine name

By default, the plugin will show in your dashboard like this:

- **File:** The path of the file or the name (if the path is unavailable)
- **Language:** `{app_name}` (uppercase, eg. `Photoshop`)
- **Project name:** `Adobe {app_name}` (e.g. `Adobe Photoshop`)
- **Editor:** `Adobe-{app_name}` (eg. `Adobe-Photoshop`)
- **Category:** Designing
- **Machine:** `Unknown Hostname` - You will have to manually specify it in UXP!

You can modify the project names, languages, category, etc. using the [Custom rules](https://wakatime.com/settings/rules) in your dashboard.

## Supported Adobe Applications

This plugin uses **Adobe Manifest v5** and **Adobe CEP 11**. Versions after `23.3.0` (UXP 6.0 or higher) should work as intended.
While older versions may also work, please note that they are not officially supported.

> **Warning**
> This plugin requires an internet connection and **will not track** time while offline.

## Installation

### UXP Compatible Applications

<details open>
<summary><b>Applications supported:</b></summary>
<blockquote>

- Photoshop
- XD has its [own implementation here](https://wakatime.com/adobe-xd)

</blockquote>
</details>

1. Download the latest version of `wakatime-adobe-uxp.zip` from the [Releases page](https://github.com/ZEBAS204/adobe-wakatime/releases) or [click here to download directly](https://github.com/ZEBAS204/adobe-wakatime/releases/latest/download/wakatime-adobe-uxp.zip).
2. Locate the plugins folder (default location):
   - **IMPORTANT: If the directory does not exist, you must create it manually.**
   - **Windows:** `C:\Program Files\Adobe\Adobe Photoshop 20xx\Plug-ins\`
   - **macOS:** `~/Library/Applications/Adobe Photoshop 20xx/Plug-ins/`
3. Extract the `wakatime-adobe` folder from the downloaded zip file into the `Plug-ins` folder.

### CEP Compatible Applications

<details open>
<summary><b>Applications supported:</b></summary>
<blockquote>

- Photoshop (only if `legacy` is available, you must uncomment `PHSP` & `PHXS` from `CSXS/manifest.xml`. Use [UXP](#uxp-compatible-applications) instead)
- Illustrator
- After Effects
- Premiere Pro
- **Please note:** these applications have been tested with this plugin, there may be other compatible Adobe applications that are not listed here.

</blockquote>
</details>

> **Warning**
> You **must Enable loading of unsigned panels**. You can find the [tutorial on how to do it here](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel#2-enable-loading-of-unsigned-panels).

1. Download the latest version of `wakatime-adobe-cep.zip` from the [Releases page](https://github.com/ZEBAS204/adobe-wakatime/releases) or [click here to download directly](https://github.com/ZEBAS204/adobe-wakatime/releases/latest/download/wakatime-adobe-cep.zip).
2. Locate the extensions folder (CEP supports 2 types of folders for unsigned extensions):

   - **IMPORTANT: If the directory does not exist, you must create it manually.**

   - **System extension folder**

     - **Win(x86):** `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
     - **Win(x64):** `C:\Program Files\Common Files\Adobe\CEP\extensions\`
     - **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/`

   - **Per-user extension folder**
     - **Windows:** `C:\Users\<USERNAME>\AppData\Roaming\Adobe\CEP\extensions\`
     - **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/`

3. Extract the `wakatime-adobe` folder from the downloaded zip file into the `extensions` folder.

## Usage

1. Open Adobe Photoshop after you installed this plugin.
2. Select **Plugins > Wakatime** in the toolbar or go to the **Plugins panel** and choose **Plugins > Plugins panel > Wakatime**.
3. Paste your **API key** into the input field and click the **Save** button ([Get your API key here](https://wakatime.com/api-key)).
4. **(Optional, UXP only)** Provide your machine name ([found in your dashboard](https://wakatime.com/dashboard)) in the **Machine name** input field. Setting this field helps avoid displaying "Unknown Hostname" on your dashboard.
5. The `status` should automatically update if the plugin is tracking time (it sends data every 2 minutes)
   - If it still shows "Disconnected," make sure you have an open file for the plugin to work. Don't worry if it initially shows "Disconnected" before you open a file.
6. To disable the plugin, **uncheck** the "Plugin enabled" checkbox.

### Status meaning

- **Status: Connected** - The plugin is working as intended.
- **Status: Disconnected** - The plugin only works when you have an open file and an internet connection. Make sure you have an open file and you are not on the Home screen.
- **Status: Unauthorized** - The provided API key is likely invalid, or you do not have permission to access the resource.
- **Status: Unavailable** - The server responded with an `error 500` and is currently unavailable.
- **Status: Disconnected (despite being working before)** - The plugin may have sent too many requests in a short period and hit a rate limit.

> **Note**
> **The status may show "Disconnected" for any connection error or bad request.**

---

## Development

### Prerequisites

1. Install [Adobe UXP Developer Tool](https://github.com/adobe-uxp/devtools-cli). Please, follow the instructions in the repository.
2. Enable Photoshop Developer Mode, go to **Edit > Preferences > Plugins > Enable Developer Mode** (you will need to relaunch Photoshop for the changes to take effect)
3. Load this plugin directly in Photoshop using the UXP Developer Tools application. Once started, click "Add Plugin..." and navigate to the "[manifest.json](plugin/manifest.json)" file in this folder.
4. If the plugin was not automatically loaded, click "Load" in the action dropdown menu (three dots)
5. Click "Watch" in the action dropdown menu (three dots)

### Installation

To install the dependencies, run the following command:

```shell
npm install
```

After installing the dependencies, build the plugin's `plugin/index.js` file (loaded by `index.html`) by running:

```shell
npm run build
```

Internally, this command runs `webpack` and builds `plugin/index.js` from the `src/index.ts` file.

### Watch mode

To automatically build the code whenever changes are made, start the watch mode (ensure UXP is watching the plugin folder, see [Prerequisites](#prerequisites)) by running:

```shell
npm run watch
```

---

Based on [UXP Photoshop Plugin Samples: Photoshop TypeScript / Webpack Sample](https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/tree/main/typescript-webpack-sample).

You can find all [CEP 11 documentation here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md).
