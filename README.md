# Wakatime Adobe Plugin

<img alt="Plugin panel preview" align="right" width="302" height="452" src=".github/preview.png">

The Wakatime plugin is a powerful integration that brings [Wakatime](https://wakatime.com/)'s time-tracking functionality to Adobe products.

**Currently supported features:**

- [x] Tracking time (every 2 min)
- [x] Tracking file path
- [x] Tracking file name
- [x] Tracking machine name

By default, the plugin will show in your dashboard like this:

- **File:** The path of the file or the name (if the path is unavailable)
- **Language:** `{app_name}` (uppercase, eg. `Photoshop`)
- **Project name:** `Adobe {app_name}` (e.g. `Adobe Photoshop`) or define your own custom project name.
- **Editor:** `Adobe-{app_name}` (eg. `Adobe-Photoshop`)
- **Category:** Designing
- **Machine:** `Unknown Hostname` - You will have to manually specify it in UXP!

You can modify the project name, language, category, etc. using the [Custom rules](https://wakatime.com/settings/rules) in your dashboard.

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

### Updating

To update, follow the same steps as the initial installation for either [CEP](#cep-compatible-applications) or [UXP](#uxp-compatible-applications). Remove the previous `wakatime-adobe` folder and replace it with the latest version from the zip file.

## Usage

1. Open Adobe Photoshop after you install this plugin.
2. Select **Plugins > Wakatime** in the toolbar or go to the **Plugins panel** and choose **Plugins > Plugins panel > Wakatime**.
3. Paste your **API key** into the input field and click the **Save** button ([Get your API key here](https://wakatime.com/api-key)).
4. **(Optional, UXP only)** Provide your machine name ([found in your dashboard](https://wakatime.com/dashboard)) in the **Machine name** input field. Setting this field helps avoid displaying "Unknown Hostname" on your dashboard.
5. The `status` should automatically update if the plugin is tracking time (it sends data every 2 minutes)
   - If it still shows "Disconnected," make sure you have an open file for the plugin to work. Don't worry if it initially shows "Disconnected" before you open a file.
6. To disable the plugin, **uncheck** the "Plugin enabled" checkbox.

### Status Meaning

- **Status: Connected** - The plugin is working as intended.
- **Status: Disconnected** - The plugin only works when you have an open file and an internet connection. Make sure you have an open file and you are not on the Home screen.
- **Status: Unauthorized** - The provided API key is likely invalid, or you do not have permission to access the resource.
- **Status: Unavailable** - The server responded with an `error 500` and is currently unavailable.
- **Status: Disconnected (despite being working before)** - The plugin may have sent too many requests in a short period and hit a rate limit.

> **Note**
> **The status may show "Disconnected" for any connection error or bad request.**

---

## Development

### CEP

#### Development Workflow for CEP

1. Install the project dependencies, execute: `npm install`
2. Run the CEP watch mode to automatically rebuild the plugin whenever changes are made. Execute: `npm run watch:cep`

#### Debugging CEP Plugins

To use the CEP plugin with the supported Adobe applications (listed in [`plugin/CSXS/manifest.xml`](./plugin/CSXS/manifest.xml)), you need to copy the `dist` folder to the appropriate location. The [`CEP.sh`](./scripts/CEP.sh) shell script automates this process.

*Follow the steps below to correctly debug the plugin:*

1. Locate the `CEP.sh` file in the `scripts` folder.
2. Open the `CEP.sh` file and specify the destination folder path for the `extensions` folder. Update the script accordingly (see [Installation: CEP Compatible Applications](#cep-compatible-applications) for the default paths)
3. Save the changes to the `CEP.sh` file.
4. Run the `CEP.sh` script. It will automatically copy the `dist` folder to the defined path.
5. Open any of the supported applications and open the plugin panel. Select **Window > Extensions > Wakatime** in the toolbar.
6. Open your browser, a Chromium-based browser is recommended for the best experience, and navigate to default host port [`localhost:7778`](http://localhost:7778/) (you can manually update all hosts debugging ports in [`plugin/.debug`](./plugin/.debug) file)
7. Whenever you make changes to the CEP plugin code, run the `CEP.sh` script again. In the DevTools, click the reload button (located at the top-left corner) to load the updated version of the CEP plugin.

### UXP

#### Prerequisites UXP

1. Install the [Adobe UXP Developer Tool](https://github.com/adobe-uxp/devtools-cli) by following the instructions provided in the repository.
2. Enable Developer Mode if available (eg. in Photoshop), go to **Edit > Preferences > Plugins > Enable Developer Mode** (you will need to relaunch Photoshop for the changes to take effect)

#### Development Workflow for UXP

1. Install the project dependencies, execute: `npm install`
2. Run the UXP watch mode to automatically rebuild the plugin whenever changes are made. Execute: `npm run watch:uxp`
3. Launch the UXP Developer Tools application.
4. Load the plugin directly in Adobe Photoshop using the UXP Developer Tools application:
   1. Click on "Add Plugin..." and navigate to the [`dist/manifest.json`](./dist/manifest.json) file in the project directory.
      - **Make sure that you use the `dist` folder and NOT the `plugin` folder when loading the plugin.**
   2. If the plugin was not automatically loaded, click "Load" in the action dropdown menu (three dots)
5. Enable live-reloading, click "Watch" in the action dropdown menu (three dots)
6. In the same dropdown menu, you can open the Chrome/Plugin dev tools by clicking "Debug"

## Building

To build both the UXP and CEP plugins simultaneously, execute the following command:

```shell
npm run build

# Or only UXP:
npm run build:uxp

# Or only CEP:
npm run build:cep
```

This command will compile both the UXP and CEP. The generated files will be packaged into a `zip` file located in the `release` folder as `wakatime-adobe-uxp` and `wakatime-adobe-cep`. Code optimizations will be applied and some debugging files removed.

> **Warning**
> Sometimes Typescript loses track of [CSInterface library](./plugin/lib/CSInterface.js). To fix any errors, copy the file from `plugin/lib/CSInterface.js` to the `src` folder.

---

Based on [UXP Photoshop Plugin Samples: Photoshop TypeScript / Webpack Sample](https://github.com/AdobeDocs/uxp-photoshop-plugin-samples/tree/main/typescript-webpack-sample).

You can find all [CEP 11 documentation here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md).
