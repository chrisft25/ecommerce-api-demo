module.exports = {

  exclude(data, args) {
    if (Array.isArray(data)) {
      return data.map((e) => {
        args.map((i) => delete e[i]);
        return e;
      });
    }
    args.map((i) => delete data[i]);
    return data;
  },
};
