import { Parameter, ParameterDocument } from "../models/parameter_model";

type GetParameterType = {
    machine: string,
    loading_time: number,
    cycle_time: number,
    oee_target: number,
    target_count: number,
    object_type: string,
    state: boolean
};

export const getParameter = async (
  machine: string
): Promise<GetParameterType> => {
  const newestParameter = await Parameter.findOne(
    { machine: machine, state: true },
    null,
    {
      sort: { _id: -1 },
    }
  );

  if (!newestParameter) {
    return {
      machine: machine,
      oee_target: 0,
      loading_time: 0,
      target_count: 0,
      cycle_time: 0,
      object_type: "",
      state: false,
    };
  }
  return newestParameter;
};
