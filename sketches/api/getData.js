const API_ENDPOINT = 'http://localhost:4000';
// TODO: Create types for queries and variables
export const getData = async ({ query, variables }) => {
  try {
    const { data, errors = [] } = await fetch(API_ENDPOINT + '/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then((res) => res.json());

    if (errors.length > 0) {
      console.log(
        `GraphQL call errored with:`,
        JSON.stringify(errors, null, 2)
      );
      throw new Error('GraphQL query failed, better check the logs.');
    }

    return data;
  } catch (err) {
    console.log('fetch() failed', err);
  }
};
