// Core viewer
import { Viewer } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance
const defaultLayoutPluginInstance = defaultLayoutPlugin();

<Viewer
    fileUrl='../content/resume/CV_2021.pdf'
    plugins={[
        // Register plugins
        defaultLayoutPluginInstance,
        ...
    ]}
/>