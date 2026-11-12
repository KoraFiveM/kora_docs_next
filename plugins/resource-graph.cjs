const graphPlugin = require('docusaurus-plugin-graph-view');

// Map snapshot folders to their public, versioned Docusaurus routes.
module.exports = function resourceGraph(context, {resources}) {
  const paths = ['docs', ...resources.map(resource => `resource-${resource.id}_versioned_docs/version-${resource.latest}`)];
  const base = context.baseUrl.endsWith('/') ? context.baseUrl.slice(0, -1) : context.baseUrl;
  const mapped = new Map([['docs', '/guides'], ...resources.map(resource => [
    `resource-${resource.id}_versioned_docs/version-${resource.latest}`,
    `/resources/${resource.id}/${resource.latest}`,
  ])]);
  const plugin = graphPlugin(context, {paths, routePath: `${base}/graph`, title:'Knowledge Graph', linkDetection:true});
  return {
    ...plugin,
    async loadContent() {
      const content = await plugin.loadContent();
      for (const node of content.graphData.nodes) {
        const prefix = mapped.get(node.group);
        if (!prefix || !node.url) continue;
        const sourcePrefix = `/${node.group}`;
        const suffix = node.url.startsWith(sourcePrefix) ? node.url.slice(sourcePrefix.length) : node.url;
        node.url = `${base}${prefix}${suffix === '/' ? '' : suffix}`;
      }
      return content;
    },
  };
};
