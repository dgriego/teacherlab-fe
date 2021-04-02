import UnitCardContainer from "../unit/unit-card-container";
import Button from "../common/button";
import { SUBJECTS } from "../../libs/constants";
import PropTypes from "prop-types";
import { useState } from "react";

export default function DashboardColumn({ subject }) {
  const [showUnitCard, setShowUnitCard] = useState(false);

  // TODO
  // props
  // image

  function toggleUnitCard(val) {
    setShowUnitCard(val);
  }

  return (
    <>
      <div className="flex flex-col justify-center">
        {showUnitCard ? (
          <UnitCardContainer
            closeAction={toggleUnitCard.bind({}, false)}
          ></UnitCardContainer>
        ) : (
          <>
            <div className="w-40 h-40 bg-abc bg-center bg-contain bg-no-repeat bg-blue rounded-full self-center"></div>

            <div className="text-center text-sm mt-4 w-80 self-center">
              You don’t have any {subject} units yet! Add an {subject} unit to
              get started.
            </div>

            <Button
              onClick={toggleUnitCard.bind({}, true)}
              text={`Add ${subject} Unit`}
              classNames="mt-36 w-7/12 self-center"
              size="md"
              type="button"
            ></Button>
          </>
        )}
      </div>
    </>
  );
}

DashboardColumn.propTypes = {
  subject: PropTypes.oneOf(Object.values(SUBJECTS)).isRequired,
  // imageSrc: PropTypes.string.isRequired,
};