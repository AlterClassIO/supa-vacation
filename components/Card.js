import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { HeartIcon } from '@heroicons/react/solid';

const Card = ({
  id = '',
  image = '',
  title = '',
  guests = 0,
  beds = 0,
  baths = 0,
  price = 0,
  favorite = false,
  onClickFavorite = () => null,
}) => (
  <Link href={`/homes/${id}`}>
    <a className="block w-full">
      <div className="relative">
        <div className="bg-gray-200 rounded-lg shadow overflow-hidden aspect-w-16 aspect-h-9">
          {image ? (
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="hover:opacity-80 transition"
            />
          ) : null}
        </div>
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            if (typeof onClickFavorite === 'function') {
              onClickFavorite(id);
            }
          }}
          className="absolute top-2 right-2"
        >
          <HeartIcon
            className={`w-7 h-7 drop-shadow-lg transition ${
              favorite ? 'text-red-500' : 'text-white'
            }`}
          />
        </button>
      </div>
      <div className="mt-2 w-full text-gray-700 font-semibold leading-tight">
        {title ?? ''}
      </div>
      <ol className="mt-1 inline-flex items-center space-x-1 text-gray-500">
        <li>
          <span>{guests ?? 0} guests</span>
          <span aria-hidden="true"> · </span>
        </li>
        <li>
          <span>{beds ?? 0} beds</span>
          <span aria-hidden="true"> · </span>
        </li>
        <li>
          <span>{baths ?? 0} baths</span>
        </li>
      </ol>
      <p className="mt-2">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price ?? 0)}{' '}
        <span className="text-gray-500">/night</span>
      </p>
    </a>
  </Link>
);

Card.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  guests: PropTypes.number,
  beds: PropTypes.number,
  baths: PropTypes.number,
  price: PropTypes.number,
  favorite: PropTypes.bool,
  onClickFavorite: PropTypes.func,
};

export default Card;
