import MembersModalContainer from '@Components/Dialogs/PmToolsModal/Member';
import { PanelTextField } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import TYPES from '@Redux/actionTypes';
import { requestSearchAction } from '@Redux/pmtools/invite/actions';
import {
  selectMembers,
  selectSearch,
  selectSearchLoader,
} from '@Redux/pmtools/invite/selectors';
import { ModalAction } from '@Src/types';
import { IMember } from '@Src/types/invite/types';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchMember from './SearchMember';

const Search = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const searchResult = useSelector(selectSearch);
  const members = useSelector(selectMembers);
  const loader = useSelector(selectSearchLoader);

  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(requestSearchAction(search));
  };

  const handleClearSearch = () => {
    setSearch('');
    dispatch({ type: TYPES.CLEAR_SEARCH });
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  useEffect(() => {
    if (searchResult) {
      const disabled = !!members.find(
        (m: IMember) => m.user_id === searchResult.id,
      );
      setDisabled(disabled);
    }
  }, [searchResult, members]);

  return (
    <>
      <h2 style={{ marginBottom: 0 }}>Search</h2>
      <form onSubmit={searchHandler}>
        <PanelTextField
          placeholder="Search"
          value={search}
          onChange={changeHandler}
          required
        />
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          style={{ marginRight: 5 }}
        >
          Search
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleClearSearch}
        >
          Clear
        </Button>
      </form>
      {loader && <p>Loading...</p>}
      {searchResult && (
        <>
          <SearchMember
            user={searchResult}
            setAddMember={setAddMember}
            isDisabled={isDisabled}
            setDisabled={setDisabled}
          />
          <MembersModalContainer
            member={searchResult}
            show={addMember}
            hide={() => setAddMember(false)}
            action={ModalAction.Create}
            setSearch={setSearch}
          />
        </>
      )}
    </>
  );
};

export default Search;
