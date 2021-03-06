import Button from "../common/button";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateUnitThunk } from "../../store/unit-slicer";
import { toast } from "react-toastify";
import { getStandardsBySetId } from "../../services/standard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import Select, { components } from "react-select";
import { setStandards, removeStandard } from "../../store/unit-slicer";
import chroma from "chroma-js";
import PropTypes from "prop-types";

const { yellow, lightGrey } = require("../../libs/theme");
const CODE_DESCRIPTION_DELIMITER = " - ";

const MultiValue = (props) => {
  // I'm replacing react-selects `MultiValue` component to render
  // only a standard code in the input when an option is selected
  // from the dropdown
  // https://react-select.com/components#replaceable-components
  return <components.MultiValue {...props} children={props.data.value} />;
};

const Option = (props) => {
  const [code, description] = props.data.label.split(
    CODE_DESCRIPTION_DELIMITER
  );

  return (
    <components.Option {...props}>
      <span className="font-semibold">{code}</span>
      {`${CODE_DESCRIPTION_DELIMITER}${description}`}
    </components.Option>
  );
};

const selectStyles = {
  control: (styles) => ({
    ...styles,
    padding: "0.25rem",
    borderColor: "black",
    ":hover": {
      borderColor: "black",
    },
  }),
  option: (styles, { data, isFocused }) => {
    const color = chroma(yellow);

    return {
      ...styles,
      fontSize: ".875rem",
      borderBottom: "1px solid black",
      backgroundColor: isFocused
        ? color.alpha(0.7).css()
        : data.index % 2 === 0 && lightGrey,
      ":active": {
        ...styles[":active"],
        backgroundColor: color.css(),
      },
    };
  },
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "black",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "black",
  }),
  menu: (styles) => ({
    ...styles,
    border: "1px solid black",
  }),
};

export default function UnitFormStandards({ setId, unitNumber, unitId }) {
  const dispatch = useDispatch();
  const [standardsPayload, setStandardsPayload] = useState([]);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const standards = useSelector((state) => state.unit.planning.standards);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!setId) return;

    getStandardsBySetId(setId).then((payload) => {
      setStandardsPayload(payload);
    });
  }, [setId]);

  const handleUnitUpdate = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateUnitThunk(unitId));
      setIsLoading(false);
      toast.success(`Unit ${unitNumber} standards has been updated.`);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  async function handleSelectedStandards() {
    // react-select expects a {value, label} data structure, here
    // we format back to original shape to keep consistent with
    // API response
    await dispatch(
      setStandards(
        selectedStandards.map((standard) => ({
          code: standard.value,
          description: standard.label.split(CODE_DESCRIPTION_DELIMITER)[1],
        }))
      )
    );
    setSelectedStandards([]);
    handleUnitUpdate();
  }

  function handleRemoveStandard(index) {
    dispatch(removeStandard(index));
  }

  return (
    <>
      <div className="bg-white w-full p-2 pb-3 border border-black">
        <div className="flex space-x-8 items-center justify-between pb-3 border-b border-black">
          <Select
            styles={selectStyles}
            instanceId="standards-select"
            className="flex-grow"
            components={{ MultiValue, Option }}
            options={standardsPayload.map((standard, index) => ({
              index,
              value: standard.code,
              label: `${standard.code}${CODE_DESCRIPTION_DELIMITER}${standard.description}`,
            }))}
            closeMenuOnSelect={false}
            onChange={(value) => setSelectedStandards(value)}
            value={selectedStandards}
            isMulti
            placeholder="Search standards by code or description..."
          />
        </div>

        {standards ? (
          <div className="overflow-auto" style={{ maxHeight: "24rem" }}>
            <table className="table-auto w-full text-sm">
              <tbody>
                {standards.map((standard, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 && lightGrey,
                    }}
                  >
                    <td className="border border-black border-t-0 text-center p-1">
                      {index + 1}
                    </td>
                    <td className="border border-black border-t-0 px-4 py-2 w-1/5 text-center font-semibold">
                      {standard.code}
                    </td>
                    <td className="border border-black border-t-0 px-4 py-2">
                      {standard.description}
                    </td>
                    <td className="border border-black border-t-0 px-4 py-2 w-1/12 text-center">
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        size="lg"
                        onClick={() => handleRemoveStandard(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center p-16">
            There are no standards attached to this unit yet.
          </div>
        )}
      </div>
      <Button
        text="Update Standards"
        size="md"
        classNames="w-48 self-end"
        rounded
        onClick={handleSelectedStandards}
        isLoading={loading}
      />
    </>
  );
}

UnitFormStandards.propTypes = {
  setId: PropTypes.number,
  unitNumber: PropTypes.number,
  unitId: PropTypes.number,
};
