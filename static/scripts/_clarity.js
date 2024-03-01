import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const {
    siteConfig: { customFields },
} = useDocusaurusContext();

if (ExecutionEnvironment.canUseDOM) {
    const clarityProjectId = customFields.clarityProjectId;
    if (clarityProjectId && typeof clarityProjectId === 'string' && clarityProjectId.length > 0) {
        // Initialize or extend the global `clarity` function to queue commands
        window.clarity = window.clarity || function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };

        // Create the script element for the Clarity tracking code
        const clarityScript = document.createElement('script');
        clarityScript.src = `https://www.clarity.ms/tag/${clarityProjectId}`;
        clarityScript.async = true;
        clarityScript.defer = true;

        // Insert the script into the head of the document
        document.head.appendChild(clarityScript);
    }
}