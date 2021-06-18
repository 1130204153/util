//传入配置，转换成antd selectTree能够使用的格式
export function formatTree(config: any) {
  const { treeData, transToOptions = [], nodeConfig = {} } = config;
  const {
    childKey = 'children',
    nodeTitleKey = 'title',
    nodeKey = 'id',
  } = nodeConfig;

  const formatData = treeData.map((treeNode: any) => {
    const isLeaf = isEmpty(treeNode[childKey]);
    const regularTreeNode = {
      ...treeNode,
      value: treeNode[nodeKey],
      label: treeNode[nodeTitleKey],
      key: treeNode[nodeKey] || guid2(),
      title: treeNode[nodeTitleKey],
      children: treeNode[childKey] || [],
      selectable: isLeaf,
      isLeaf,
    };

    transToOptions.push(regularTreeNode);
    if (regularTreeNode[childKey] && regularTreeNode[childKey].length > 0) {
      return {
        ...regularTreeNode,
        children: formatTree({
          treeData: regularTreeNode[childKey],
          transToOptions,
          nodeConfig,
        })[0],
      };
    }
    return regularTreeNode;
  });
  return [formatData, transToOptions];
}
