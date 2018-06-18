class BabySerializer < ActiveModel::Serializer
  attributes :id, :name, :sex, :birth, :mother_id
end
